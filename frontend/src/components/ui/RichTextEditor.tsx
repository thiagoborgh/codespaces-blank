import React, { useState, useRef } from 'react';

interface TextFormatting {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  quote: boolean;
}

interface RichTextEditorProps {
  value: string;
  formatting: TextFormatting;
  onChange: (value: string, formatting: TextFormatting) => void;
  maxLength: number;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  formatting,
  onChange,
  maxLength,
  placeholder = "Digite aqui...",
  className = ""
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState<string>('');

  const handleFormat = (formatType: keyof TextFormatting) => {
    const newFormatting = { ...formatting, [formatType]: !formatting[formatType] };
    onChange(value, newFormatting);
    
    // Aplicar formatação no editor
    if (editorRef.current) {
      document.execCommand(getFormatCommand(formatType), false);
    }
  };

  const getFormatCommand = (formatType: keyof TextFormatting): string => {
    switch (formatType) {
      case 'bold': return 'bold';
      case 'italic': return 'italic';
      case 'underline': return 'underline';
      case 'strikethrough': return 'strikeThrough';
      case 'quote': return 'formatBlock';
      default: return '';
    }
  };

  const handleUndo = () => {
    document.execCommand('undo', false);
  };

  const handleRedo = () => {
    document.execCommand('redo', false);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerText;
      if (newValue.length <= maxLength) {
        onChange(newValue, formatting);
      } else {
        // Reverter se exceder o limite
        editorRef.current.innerText = value;
      }
    }
  };

  const getButtonClass = (isActive: boolean) => 
    `px-3 py-1 rounded border text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-blue-100 text-blue-700 border-blue-300' 
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    }`;

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-3 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className={getButtonClass(formatting.bold)}
          title="Negrito"
        >
          <strong>B</strong>
        </button>
        
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className={getButtonClass(formatting.italic)}
          title="Itálico"
        >
          <em>I</em>
        </button>
        
        <button
          type="button"
          onClick={() => handleFormat('underline')}
          className={getButtonClass(formatting.underline)}
          title="Sublinhado"
        >
          <u>U</u>
        </button>
        
        <button
          type="button"
          onClick={() => handleFormat('strikethrough')}
          className={getButtonClass(formatting.strikethrough)}
          title="Tachado"
        >
          <s>S</s>
        </button>
        
        <button
          type="button"
          onClick={() => handleFormat('quote')}
          className={getButtonClass(formatting.quote)}
          title="Citação"
        >
          "
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button
          type="button"
          onClick={handleUndo}
          className="px-3 py-1 rounded border text-sm font-medium bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          title="Desfazer"
        >
          ⤺
        </button>
        
        <button
          type="button"
          onClick={handleRedo}
          className="px-3 py-1 rounded border text-sm font-medium bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          title="Refazer"
        >
          ↷
        </button>
        
        <div className="flex-1" />
        
        <span className="text-sm text-gray-500">
          {value.length}/{maxLength}
        </span>
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[150px] focus:outline-none"
        style={{ minHeight: '150px' }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      >
        {value || <span className="text-gray-400">{placeholder}</span>}
      </div>
    </div>
  );
};

export default RichTextEditor;
