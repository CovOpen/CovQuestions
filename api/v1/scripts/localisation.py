import json
import hashlib
import xml.etree.ElementTree as ET
import os
import logging
import argparse

STRING_KEYS = ('title', 'text', 'asQuestion', 'details', 'description')


def build_string_index(path_questionnaire):
	"""
	Extract all strings from a questionnaire that should be translated.
	"""
	string_index = {}

	def obj_hook_string_extraction(obj):
		# for each key check if it is available
		for key in STRING_KEYS:
			if key in obj:
				# calculate an ID for this string and save it to index
				string = obj[key].strip()
				string_hash = hashlib.md5(string.encode()).hexdigest()
				string_index[string_hash] = {
					"source": string,
					"target": string,
					"state": "new"
				}
		return obj
	
	# load questionnaire with hook
	with open(path_questionnaire) as f:
		questionnaire = json.load(f, object_hook=obj_hook_string_extraction)

	logging.info("Found {:d} strings in {:s}".format(len(string_index), path_questionnaire))

	return questionnaire, string_index


def load_string_index(path_xliff_file, warn=True):
	"""
	Load a string index from xliff file.
	"""

	string_index = {}
	counter_translated = 0

	xml = ET.parse(path_xliff_file)
	xml_body = xml.getroot().find('file').find('body')
	
	for unit in xml_body.findall('trans-unit'):
		unit_id = unit.attrib['id']
		source = unit.find('source')
		state = 'ready' if 'state' not in source.attrib else source.attrib['state']
		string_index[unit_id] = {
			"source": source.text,
			"target": unit.find('target').text,
			"state": state
		}

		if state != 'ready':
			if warn:
				logging.warn("String '{:s}' ({:s}) has no translation in {:s}".format(source.text, unit_id, path_xliff_file))
		else:
			counter_translated += 1

	logging.info("Loaded {:d} strings from {:s}, {:d} have translations".format(len(string_index), path_xliff_file, counter_translated))
	return string_index


def join_string_indices(base_index, tranlation_index):
	"""
	Join two string indices
	"""
	return {
		**base_index,
		**tranlation_index
	}
	

def write_string_index(string_index, path_xliff_file, base_language, language):
	"""
	Save a string index to file
	"""

	# if file exists, join translations
	if os.path.isfile(path_xliff_file):
		translation = load_string_index(path_xliff_file, warn=False)
		string_index = join_string_indices(string_index, translation)

	xml_root = ET.Element('xliff', {'version': "1.2"}) #, 'xmlns': "urn:oasis:names:tc:xliff:document:1.2"})
	xml_file = ET.SubElement(xml_root, "file", {"source-language": base_language, "datatype": "plaintext", "original": "covquestion.questinnaire", "target-language": language})
	xml_body = ET.SubElement(xml_file, "body")

	for string_id, string in string_index.items():
		xml_trans = ET.SubElement(xml_body, 'trans-unit', {'id': string_id})
		xml_trans_source = ET.SubElement(xml_trans, "source")
		if string['state'] != 'ready' and language != base_language:
			xml_trans_source.set('state', string['state'])
		xml_trans_source.text = string["source"]
		xml_trans_target = ET.SubElement(xml_trans, "target")
		xml_trans_target.text = string["target"]

	xml = ET.ElementTree(xml_root)
	xml.write(path_xliff_file, encoding="UTF-8", xml_declaration=True)


def translate_questionnaire(path_questionnaire, path_xliff_file, output_path, language):
	"""
	Extract all strings from a questionnaire that should be translated.
	Save the translated questionnaire as new json.
	"""
	string_index = load_string_index(path_xliff_file)

	def obj_hook_string_replacement(obj):
		# for each key check if it is available
		for key in STRING_KEYS:
			if key in obj:
				# calculate an ID for this string and save it to index
				string = obj[key].strip()
				string_hash = hashlib.md5(string.encode()).hexdigest()
				if string_hash in string_index:
					obj[key] = string_index[string_hash]['target']
				else:
					logging.warn("Could not find translation for '{:s}' ({:s}) in {:s}".format(string, string_hash, path_xliff_file))
		return obj
	
	# load questionnaire with hook
	with open(path_questionnaire) as f:
		questionnaire = json.load(f, object_hook=obj_hook_string_replacement)

	questionnaire['meta']['language'] = language

	# save questionnaire as new file
	with open(output_path, 'w') as f:
		json.dump(questionnaire, f, ensure_ascii=False)

	return questionnaire


def get_languages(path_translations, additional_languages=[]):
	languages = []
	# get all translation files in the folder
	language_files = os.listdir(path_translations)
	# push changes to them
	for language_file in language_files:
		if language_file[:12] != 'translation.' and language_file[-4:] != '.xlf':
			continue
		languages.append(language_file.replace('translation.', '').replace('.xlf', ''))
	
	languages += additional_languages
	return set(languages)


def translate(path_questionnaire, path_translations, api_questionnaire_folder):
	# load questionnaire and its string index
	questionnaire, string_index = build_string_index(path_questionnaire)

	# get base language
	base_language = questionnaire['meta']['language'].lower()
	version = questionnaire['version'].split('.')[0]  # take only major version
	# create version folder
	version_folder = os.path.join(api_questionnaire_folder, 'v'+str(version))
	if not os.path.isdir(version_folder):
		os.makedirs(version_folder)

	# create an array of translations to consider
	languages = get_languages(path_translations, [base_language])
	
	# loop languages, create a translation file and translate questionnaire
	for language in set(languages):
		# create translation file
		path_translation = os.path.join(path_translations, 'translation.{:s}.xlf'.format(language))
		write_string_index(string_index, path_translation, base_language, language)
		# translate questionnaire
		output_path = os.path.join(version_folder, 'questionnaire-{:s}.json'.format(language))
		translate_questionnaire(path_questionnaire, path_translation, output_path, language)


def extract(path_questionnaire, path_translations, languages=[]):

	# load questionnaire and its string index
	questionnaire, string_index = build_string_index(path_questionnaire)

	# get base language
	base_language = questionnaire['meta']['language'].lower()
	
	# create an array of translations to consider
	languages = get_languages(path_translations, languages + [base_language])
	
	# loop languages, create a translation file and translate questionnaire
	for language in set(languages):
		# create translation file
		path_translation = os.path.join(path_translations, 'translation.{:s}.xlf'.format(language))
		write_string_index(string_index, path_translation, base_language, language)


if __name__ == "__main__":

	parser = argparse.ArgumentParser()
	parser.add_argument('action', help="One of extract or translate", choices=['extract', 'translate'])
	parser.add_argument('questionnaire', help="Questionnaire ID")
	parser.add_argument('-l', '--languages', help="Languages to extract", nargs='*', default=[])

	args = parser.parse_args()


	api_root_folder = os.path.abspath(
		os.path.join(
			os.path.dirname(__file__), '..'
		)
	)
	questionnaire_root = os.path.join(api_root_folder, 'src', 'questionnaires', args.questionnaire)
	path_questionnaire = os.path.join(questionnaire_root, 'questionnaire.json')
	api_questionnaire_folder = os.path.join(api_root_folder, 'questionnaires', args.questionnaire)

	if args.action == 'extract':
		extract(path_questionnaire, questionnaire_root, languages=args.languages)
	
	elif args.action == 'translate':
		translate(path_questionnaire, questionnaire_root, api_questionnaire_folder)

	else:
		raise RuntimeError("Invalid Action")