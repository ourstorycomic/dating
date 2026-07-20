const fs = require('fs');
let c = fs.readFileSync('components/dashboard/OrderBuilderForm.tsx', 'utf8');

// 1. Add isGoi3KhacMau and activeTemplateId
c = c.replace(
  /const isGoi1 = selectedPackage\?\.includes\("goi1"\) \|\| false;/,
  `const isGoi1 = selectedPackage?.includes("goi1") || false;\n  const isGoi3KhacMau = selectedPackage?.includes("goi3-khac") || false;\n  const activeTemplateId = (isGoi3KhacMau && activeTab === "gai") ? (dynamicData?.gai?.templateId || selectedTemplateId) : selectedTemplateId;`
);

// 2. Change selectedTemplate useMemo to use activeTemplateId instead of selectedTemplateId
c = c.replace(
  /if \(loadedTemplate && String\(loadedTemplate\.id\) === String\(selectedTemplateId\)\) \{/g,
  `if (loadedTemplate && String(loadedTemplate.id) === String(activeTemplateId)) {`
);
c = c.replace(
  /return templates\.find\(\(template\) => String\(template\.id\) === String\(selectedTemplateId\)\) \?\? valentineOne;/g,
  `return templates.find((template) => String(template.id) === String(activeTemplateId)) ?? valentineOne;`
);
c = c.replace(
  /\[selectedTemplateId, templates, valentineOne, loadedTemplate\],/g,
  `[activeTemplateId, templates, valentineOne, loadedTemplate],`
);

// 3. Update onClick in template dropdown (line 1551 approximately)
// It looks like: setSelectedTemplateId(template.id);
c = c.replace(
  /setSelectedTemplateId\(template\.id\);\s*setTemplateSearch\(template\.name\);/,
  `if (isGoi3KhacMau && activeTab === "gai") {
                            setDynamicData((d: any) => ({ ...d, gai: { ...(d.gai || {}), templateId: template.id, componentKey: template.component_key } }));
                          } else {
                            setSelectedTemplateId(template.id);
                          }
                          setTemplateSearch(template.name);`
);

// 4. Update the "isSelected" logic for the dropdown items
c = c.replace(
  /const isSelected = template\.id === selectedTemplateId;/,
  `const isSelected = template.id === activeTemplateId;`
);

// 5. In createOrder and updateOrder, make sure we use selectedTemplateId instead of selectedTemplate?.id
// (Wait, wait, selectedTemplate?.id is fine as long as we switch it back? Actually, selectedTemplateId is safer)
c = c.replace(
  /templateId: selectedTemplate\?\.id,/g,
  `templateId: selectedTemplateId,`
);

fs.writeFileSync('components/dashboard/OrderBuilderForm.tsx', c, 'utf8');
console.log('Fixed OrderBuilderForm for goi3-khac template selection!');
