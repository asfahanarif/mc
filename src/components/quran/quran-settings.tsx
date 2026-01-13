
'use client';

import { useQuranSettings } from './quran-settings-provider';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';

const ALLOWED_TRANSLATION_IDENTIFIERS = [
  'en.sahih',
  'ur.junagarhi',
  'en.hilali',
];

const translationLabels: { [key: string]: string } = {
  'en.sahih': 'Sahih International (EN)',
  'en.hilali': 'Hilali & Khan (EN)',
  'ur.junagarhi': 'Muhammad Junagarhi (UR)',
};

export function QuranSettings() {
  const {
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize,
    lineHeight,
    setLineHeight,
    selectedTranslations,
    setSelectedTranslations,
    showTranslation,
    setShowTranslation,
  } = useQuranSettings();

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h3 className="font-medium">Translations</h3>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Select ({selectedTranslations.length})</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Display Translations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALLOWED_TRANSLATION_IDENTIFIERS.map(id => (
                    <DropdownMenuCheckboxItem
                        key={id}
                        checked={selectedTranslations.includes(id)}
                        onCheckedChange={(checked) => {
                            setSelectedTranslations(prev => 
                                checked ? [...prev, id] : prev.filter(t => t !== id)
                            );
                        }}
                    >
                        {translationLabels[id]}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center justify-between mt-2">
            <Label htmlFor="show-translation" className="flex flex-col space-y-1">
              <span>Show Translation</span>
            </Label>
            <Switch
              id="show-translation"
              checked={showTranslation}
              onCheckedChange={setShowTranslation}
            />
          </div>
      </div>
      <div className="grid gap-4">
        <h3 className="font-medium">Text Size</h3>
        <div className="grid gap-2">
          <Label htmlFor="arabic-size">Arabic</Label>
          <Slider
            id="arabic-size"
            min={1}
            max={3}
            step={0.1}
            value={[arabicFontSize]}
            onValueChange={(value) => setArabicFontSize(value[0])}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="translation-size">Translation</Label>
          <Slider
            id="translation-size"
            min={0.8}
            max={2}
            step={0.1}
            value={[translationFontSize]}
            onValueChange={(value) => setTranslationFontSize(value[0])}
            disabled={!showTranslation}
          />
        </div>
      </div>
       <div className="grid gap-4">
        <h3 className="font-medium">Line Height</h3>
        <div className="grid gap-2">
          <Slider
            id="line-height"
            min={1.2}
            max={2.5}
            step={0.1}
            value={[lineHeight]}
            onValueChange={(value) => setLineHeight(value[0])}
          />
        </div>
      </div>
    </div>
  );
}
