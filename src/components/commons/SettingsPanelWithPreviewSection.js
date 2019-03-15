import React from 'react';

const SettingsPanelWithPreviewSection = ({ settingsSections, width, preview }) => {
  let widePreviewPlaceholder = null;
  let narrowPreviewPlaceholder = null;
  if (width < 995) {
    narrowPreviewPlaceholder = (
      <div>
        <br />
        {preview}
      </div>
    );
  } else {
    widePreviewPlaceholder = <td>{preview}</td>;
  }

  return (
    <div>
      <table border={0} width="100%">
        <tbody>
          <tr>
            <td valign="top" style={{ width: '330px' }}>
              {settingsSections.map((item, key) => {
                return (
                  <div key={key}>
                    {key !== 0 && <br />}
                    {item}
                  </div>
                );
              })}
            </td>
            {widePreviewPlaceholder}
          </tr>
        </tbody>
      </table>
      {narrowPreviewPlaceholder}
    </div>
  );
};
export default SettingsPanelWithPreviewSection;
