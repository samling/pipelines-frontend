type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface JsonEditorProps {
  data: { [key: string]: JsonValue };
  onChange: (newData: { [key: string]: JsonValue }) => void;
  disabled?: boolean;
}

interface FieldEditorProps {
  name: string;
  value: JsonValue;
  onChange: (newValue: JsonValue) => void;
  disabled?: boolean;
}

const FieldEditor = ({ name, value, onChange, disabled }: FieldEditorProps) => {
  const getInputType = (value: JsonValue) => {
    if (typeof value === 'boolean') return 'checkbox';
    if (typeof value === 'number') return 'number';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    return 'text';
  };

  const inputClassNames = "block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2";

  const renderInput = () => {
    const inputType = getInputType(value);

    switch (inputType) {
      case 'checkbox':
        return (
          <div className="px-3 py-2"> {/* Added padding container for checkbox */}
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              disabled={disabled}
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value as number}
            onChange={(e) => onChange(Number(e.target.value))}
            className={inputClassNames}
            disabled={disabled}
          />
        );

      case 'array':
        return (
          <div className="space-y-2 px-3 py-2"> {/* Added padding for array container */}
            {(value as JsonValue[]).map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <FieldEditor
                  name={`${name}[${index}]`}
                  value={item}
                  onChange={(newValue) => {
                    const newArray = [...(value as JsonValue[])];
                    newArray[index] = newValue;
                    onChange(newArray);
                  }}
                  disabled={disabled}
                />
                <button
                  onClick={() => {
                    const newArray = (value as JsonValue[]).filter((_, i) => i !== index);
                    onChange(newArray);
                  }}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50 px-2"
                  disabled={disabled}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => onChange([...(value as JsonValue[]), null])}
              className="text-blue-500 hover:text-blue-700 text-sm disabled:opacity-50 px-2 py-1"
              disabled={disabled}
            >
              + Add Item
            </button>
          </div>
        );

      case 'object':
        return (
          <div className="pl-4 border-l-2 border-gray-300 dark:border-gray-600 py-2">
            <JsonEditor
              data={value as { [key: string]: JsonValue }}
              onChange={(newValue) => onChange(newValue)}
              disabled={disabled}
            />
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className={inputClassNames}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300 px-3">
        {name}
      </div>
      <div className={`w-2/3 ${disabled ? 'opacity-50' : ''}`}>
        {renderInput()}
      </div>
    </div>
    );
  };

const JsonEditor = ({ data, onChange, disabled }: JsonEditorProps) => {
  return (
    <div className="space-y-1">
      {Object.entries(data).map(([key, value]) => (
        <FieldEditor
          key={key}
          name={key}
          value={value}
          onChange={(newValue) => {
            onChange({
              ...data,
              [key]: newValue,
            });
          }}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default JsonEditor;