export const uiSchemaLogic = (rows = 10) => ({
  "ui:widget": "textarea",
  "ui:options": {
    rows,
  },
});

export const uiSchemaLogicReadOnly = (rows = 10) => ({
  ...uiSchemaLogic(rows),
  "ui:readonly": true,
});
