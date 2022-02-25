import { BuiltinPresetName, builtinPresets } from './presets'
import type { Preset, Import } from './types'

export function resolvePreset (preset: Preset): Import[] {
  const imports: Import[] = []
  for (const _import of preset.imports) {
    if (typeof _import === 'string') {
      imports.push({ name: _import, as: _import, from: preset.from })
    } else if (Array.isArray(_import)) {
      imports.push({ name: _import[0], as: _import[1] || _import[0], from: _import[2] || preset.from })
    } else if ((_import as Preset).imports) {
      imports.push(...resolvePreset(_import as Preset))
    } else {
      imports.push({ from: preset.from, ..._import as Import })
    }
  }
  return imports
}

export function resolveBuiltinPresets (presets: (BuiltinPresetName | Preset)[]): Import[] {
  return presets.flatMap((p) => {
    let preset = typeof p === 'string' ? builtinPresets[p] : p
    if (typeof preset === 'function') {
      preset = preset()
    }
    return resolvePreset(preset)
  })
}
