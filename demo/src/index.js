import React, { useState } from "react";
import { render } from "react-dom";

import Editor from "../../src";
import styles from "../../src/styles.module.css";
import { Button, ConfigProvider, Divider, Drawer, FloatButton, Select, Space, Switch } from "antd";
import Icons from "../../src/icons";

import i18n from "../../src/i18n";
import punctuationCorrections from "./punctuationCorrections";
import wordList from './wordList';
import autoCorrection from './autoCorrection';

const urduFonts = [
  { value: 'AlviLahoriNastaleeq', label: 'Alvi Lahori Nastaleeq' },
  { value: 'FajerNooriNastalique', label: 'Fajer Noori Nastalique' },
  { value: 'gulzar-nastalique', label: 'Gulzar Nastalique' },
  { value: 'EmadNastaleeq', label: 'Emad Nastaleeq' },
  { value: 'NafeesWebNaskh', label: 'Nafees Web Naskh' },
  { value: 'NafeesNastaleeq', label: 'Nafees Nastaleeq' },
  { value: 'MehrNastaleeq', label: 'Mehr Nastaleeq' },
  { value: 'AdobeArabic', label: 'Adobe Arabic' },
  { value: 'Dubai', label: 'Dubai' },
  { value: 'Noto Naskh Arabic', label: 'Noto Naskh Arabic' },
  { value: 'Noto Nastaliq Urdu', label: 'Noto Nastaliq Urdu' },
  { value: 'Jameel Noori Nastaleeq', label: 'Jameel Noori Nastaleeq' },
  { value: 'jameel-khushkhati', label: 'Jameel Khushkhati' },
  { value: 'JameelNooriNastaleeqKasheeda', label: 'Jameel Noori Nastaleeq Kasheeda' }
];
const Demo = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(undefined);
  const [configuration, setConfiguration] = useState({
    richText: true,
    language: "ur",
    toolbar: {
      fonts: urduFonts,
      defaultFont: 'MehrNastaleeq',
      showAlignment: true,
      showBlockFormat: true,
      showFontFormat: true,
      showInsert: true,
      showListFormat: true,
      showUndoRedo: true,
      showExtraFormat: true,
      showInsertLink: true,
      showSave: true,
    },
    spellchecker: {
      enabled : true,
      punctuationCorrections: (lang) => punctuationCorrections[lang],
      autoCorrections: (lang) => autoCorrection[lang],
      wordList : (lang) => wordList[lang]
    },
    format: "raw",
  });
  const locale = i18n[configuration.language];
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const setEditorValue = () => {
    if (configuration.richText) {
      if (configuration.format === "markdown") {
        setValue(`## حسن کوزہ گر

        جہاں زاد
        `);
      }
      else
      {
        setValue('{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"حسن کوزہ گر","type":"text","version":1}],"direction":"rtl","format":"","indent":0,"type":"heading","version":1,"tag":"h1"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"جہاں زاد","type":"text","version":1}],"direction":"rtl","format":"","indent":0,"type":"paragraph","version":1}],"direction":"rtl","format":"","indent":0,"type":"root","version":1}}');
      }
    } else {
      setValue("حسن کوزہ گر");
    }
  }

  const changeLanguage = (value) => {
    setConfiguration((e) => ({ ...e, language: value, toolbar: { ...e.toolbar, fonts: value == "ur" ? urduFonts : null }}))
  }

  return (
    <ConfigProvider
      direction={configuration.language == "ur" ? "rtl" : "ltr"}
      locale={configuration.language}
      componentSize="large"
    >
      <div className={styles.editorShell} style={{ direction: locale.direction }}>
        <Editor
          configuration={configuration}
          value={value}
          onChange={(val) => console.log('OnChange: ', val)}
          onSave={(contents) => console.log('OnSave: ', contents)}
        />
      </div>
      <FloatButton icon={<Icons.Setting />} onClick={showDrawer} />
      <Drawer
        title="Settings"
        icon={<Icons.Setting />}
        placement="right"
        onClose={onClose}
        open={open}
      >
        <Space direction="vertical">
          <Switch
            checkedChildren="Rich Text"
            unCheckedChildren="Plain Text"
            defaultChecked={configuration.richText}
            onChange={(checked) =>
              setConfiguration((e) => ({ ...e, richText: checked }))
            }
          />
          <Select
            defaultValue={configuration.language}
            onChange={(value) =>
              setConfiguration(changeLanguage)
            }
            options={[
              {
                value: "en",
                label: "English",
              },
              {
                value: "ur",
                label: "Urdu",
              },
            ]}
          />
          <Divider />
          <Select
            defaultValue={configuration.format}
            onChange={(value) =>
              setConfiguration((e) => ({ ...e, format: value }))
            }
            options={[
              {
                value: "raw",
                label: "Raw",
              },
              {
                value: "markdown",
                label: "Markdown",
              },
            ]}
          />
          <Divider />
          <Switch
            checkedChildren="Show Alignment"
            unCheckedChildren="Hide Alignment"
            defaultChecked={configuration.toolbar.showAlignment}
            onChange={(checked) =>
              setConfiguration((e) => ({ ...e, toolbar: {... e.toolbar, showAlignment : checked } }))
            }
          />
          <Switch
              checkedChildren="Show Undo/Redo"
              unCheckedChildren="Hide Undo/Redo"
              defaultChecked={configuration.toolbar.showUndoRedo}
              onChange={(checked) =>
                setConfiguration((e) => ({ ...e, toolbar: {... e.toolbar, showUndoRedo : checked } }))
              }
            />
          <Switch
              checkedChildren="Show Block Format"
              unCheckedChildren="Hide Block Format"
              defaultChecked={configuration.toolbar.showBlockFormat}
              onChange={(checked) =>
                setConfiguration((e) => ({ ...e, toolbar: {... e.toolbar, showBlockFormat : checked } }))
              }
            />
          <Switch
              checkedChildren="Show Insert"
              unCheckedChildren="Hide Insert"
              defaultChecked={configuration.toolbar.showInsert}
              onChange={(checked) =>
                setConfiguration((e) => ({ ...e, toolbar: {... e.toolbar, showInsert : checked } }))
              }
            />
          <Switch
              checkedChildren="Show Font Format"
              unCheckedChildren="Hide Font Format"
              defaultChecked={configuration.toolbar.showFontFormat}
              onChange={(checked) =>
                setConfiguration((e) => ({ ...e, toolbar: {... e.toolbar, showFontFormat : checked } }))
              }
            />
          <Switch
              checkedChildren="Show extra formatting options"
              unCheckedChildren="Hide extra formatting options"
              defaultChecked={configuration.toolbar.showExtraFormat}
              onChange={(checked) =>
                setConfiguration((e) => ({ ...e, toolbar: {... e.toolbar, showExtraFormat : checked } }))
              }
            />
          <Switch
              checkedChildren="Show link options"
              unCheckedChildren="Hide link options"
              defaultChecked={configuration.toolbar.showInsertLink}
              onChange={(checked) =>
                setConfiguration((e) => ({ ...e, toolbar: {... e.toolbar, showInsertLink : checked } }))
              }
            />
          <Divider />
          <Switch
              checkedChildren="Spell Check"
              unCheckedChildren="No Spell Check"
              defaultChecked={configuration.spellchecker.enabled}
              onChange={(checked) =>
                setConfiguration((e) => ({ ...e, spellchecker: {... e.spellchecker, enabled : checked } }))
              }
            />
          <Divider />
          <Button onClick={setEditorValue}>
              Change Value
          </Button>
        </Space>
      </Drawer>
    </ConfigProvider>
  );
};

render(<Demo />, document.querySelector("#app"));
