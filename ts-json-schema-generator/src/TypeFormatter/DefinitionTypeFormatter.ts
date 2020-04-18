import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { DefinitionType } from "../Type/DefinitionType";
import { TypeFormatter } from "../TypeFormatter";
import { uniqueArray } from "../Utils/uniqueArray";

export class DefinitionTypeFormatter implements SubTypeFormatter {
    public constructor(private childTypeFormatter: TypeFormatter, private encodeRefs: boolean) { }

    public supportsType(type: DefinitionType): boolean {
        return type instanceof DefinitionType;
    }
    public getDefinition(type: DefinitionType): Definition {
        const ref = type.getName();
        const definition: Definition = { $ref: `#/definitions/${this.encodeRefs ? encodeURIComponent(ref) : ref}` };
        const elementType: any = type.getType();
        if ((elementType != null) && (elementType.annotations != null) && (elementType.annotations.title != null)) {
            definition.title = elementType.annotations.title;
        }
        return definition
    }
    public getChildren(type: DefinitionType): BaseType[] {
        return uniqueArray([type, ...this.childTypeFormatter.getChildren(type.getType())]);
    }
}
