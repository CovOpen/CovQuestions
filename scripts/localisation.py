import json
import hashlib
import xml.etree.ElementTree as ET
import os
import logging


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


def load_string_index(path_xliff_file):
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
		translation = load_string_index(path_xliff_file)
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


def translate_questionnaire(path_questionnaire, path_xliff_file, output_path):
	"""
	Extract all strings from a questionnaire that should be translated.
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
					obj[key] = string_index[string_hash]
				else:
					logging.warn("Could not find translation for '{:s}' ({:s}) in {:s}".format(string, string_hash, path_xliff_file))
		return obj
	
	# load questionnaire with hook
	with open(path_questionnaire) as f:
		questionnaire = json.load(f, object_hook=obj_hook_string_replacement)

	# save questionnaire as new file
	with open(output_path, 'w') as f:
		json.dump(questionnaire, f)

	return questionnaire


def process_questionnaire(path_questionnaire, path_translations, languages=None):

	# load questionnaire and its string index
	questionnaire, string_index = build_string_index(path_questionnaire)

	# get base language
	base_language = questionnaire['meta']['language'].lower()

	# save translation file for base language
	write_string_index(string_index, os.path.join(path_translations, 'translation.{:s}.xlf'.format(base_language)), base_language, base_language)


	if languages is None:
		languages = []
		# get all translation files in the folder
		language_files = os.listdir(path_translations)
		# push changes to them
		for language_file in language_files:
			if language_file[:12] != 'translation.' and language_file[-4:] != '.xlf':
				continue
		languages.append(language_file.replace('translation.', '').replace('.xlf', ''))

	for language in languages:
		write_string_index(string_index, os.path.join(path_translations, 'translation.{:s}.xlf'.format(language)), base_language, language)



if __name__ == "__main__":
	process_questionnaire('/home/msimon/Documents/Programming/hackathon/covquestions/react-with-json-logic/public/api/example1.json', '.', ['en'])
	
	

