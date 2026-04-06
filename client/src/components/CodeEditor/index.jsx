import { useState } from 'react';
import './CodeEditor.css';

function CodeEditor({ value, onChange, language = 'javascript' }) {
  return (
    <div className="code-editor">
      <div className="editor-header">
        <span className="editor-lang">{language}</span>
        <button
          className="editor-clear"
          onClick={() => onChange('')}
          type="button"
        >
          Clear
        </button>
      </div>
      <textarea
        className="editor-textarea"
        value={value}
        onChange={e => onChange(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        rows={16}
        placeholder={`// Write your ${language} solution here...`}
      />
    </div>
  );
}

export default CodeEditor;