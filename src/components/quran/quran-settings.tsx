
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TranslationEdition } from '@/lib/types';


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


export function QuranSettings({ allTranslations }: { allTranslations: TranslationEdition[]}) {
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
    arabicFont,
    setArabicFont,
    translationFont,
    setTranslationFont,
  } = useQuranSettings();

  const availableTranslations = allTranslations.filter(t => ALLOWED_TRANSLATION_IDENTIFIERS.includes(t.identifier));

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h3 className="font-medium">Translations</h3>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Select Translations ({selectedTranslations.length})</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>Display Translations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableTranslations.map(trans => (
                    <DropdownMenuCheckboxItem
                        key={trans.identifier}
                        checked={selectedTranslations.includes(trans.identifier)}
                        onCheckedChange={(checked) => {
                            setSelectedTranslations(prev => 
                                checked ? [...prev, trans.identifier] : prev.filter(t => t !== trans.identifier)
                            );
                        }}
                    >
                        {trans.englishName}
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
        <h3 className="font-medium">Fonts</h3>
        <div className="grid gap-2">
          <Label htmlFor="arabic-font">Arabic Font</Label>
          <Select value={arabicFont} onValueChange={setArabicFont}>
            <SelectTrigger id="arabic-font">
                <SelectValue placeholder="Select Arabic Font" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="'Noto Naskh Arabic', serif">Noto Naskh Arabic</SelectItem>
                <SelectItem value="'Amiri', serif">Amiri</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="translation-font">Translation Font</Label>
          <Select value={translationFont} onValueChange={setTranslationFont} disabled={!showTranslation}>
            <SelectTrigger id="translation-font">
                <SelectValue placeholder="Select Translation Font" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                <SelectItem value="'Cormorant Garamond', serif">Cormorant Garamond</SelectItem>
                <SelectItem value="'Noto Nastaliq Urdu', serif">Noto Nastaliq Urdu</SelectItem>
            </SelectContent>
          </Select>
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
