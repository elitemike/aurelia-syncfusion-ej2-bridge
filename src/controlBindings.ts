export const ControlBindings = {
  common: {
    oneWay: ["disabled"]
  },
  button: {
    oneWay: ["isPrimary", "content", "cssClass", "enablePersistence", "iconCss", "iconPosition", "isToggle", "enableRtl"],
  },
  checkbox: {
    oneWay: ["checked", "cssClass", "enablePersistence", "enableRtl", "indeterminate", "label", "labelPosition", "locale", "name", "value"]
  },
  progressButton: {
    oneWay: ["animationSettings", "content", "cssClass", "duration", "enablePersistence", "enableProgress", "enableRtl", "iconCss", "iconPosition", "isPrimary", "isToggle", "spinSettings"]
  },
  radio: {
    oneWay: ["checked", "cssClass", "enablePersistence", "enableRtl", "label", "labelPosition", "locale", "name", "value"]
  }
}
