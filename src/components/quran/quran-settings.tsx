
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
import { ScrollArea } from '../ui/scroll-area';

const ALLOWED_TRANSLATION_IDENTIFIERS = [
  'en.sahih',
  'ur.junagarhi',
  // 'en.hilali', // Removed as per request
];

export function QuranSettings({ allTranslations, settingType }: { allTranslations: TranslationEdition[], settingType: 'translations' | 'fonts' }) {
  const settings = useQuranSettings();

  const availableTranslations = allTranslations.filter(t => ALLOWED_TRANSLATION_IDENTIFIERS.includes(t.identifier));

  if (settingType === 'translations') {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
            <Label htmlFor="show-translation" className="font-medium">
              Show Translations
            </Label>
            <Switch
              id="show-translation"
              checked={settings.showTranslation}
              onCheckedChange={settings.setShowTranslation}
            />
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between" disabled={!settings.showTranslation}>
                    <span>Select ({settings.selectedTranslations.length})</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>Display Translations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-48">
                  {availableTranslations.map(trans => (
                      <DropdownMenuCheckboxItem
                          key={trans.identifier}
                          checked={settings.selectedTranslations.includes(trans.identifier)}
                          onCheckedChange={(checked) => {
                              settings.setSelectedTranslations(prev => 
                                  checked ? [...prev, trans.identifier] : prev.filter(t => t !== trans.identifier)
                              );
                          }}
                      >
                          {trans.englishName}
                      </DropdownMenuCheckboxItem>
                  ))}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  if (settingType === 'fonts') {
    return (
       <div className="grid gap-6">
        <div className="grid gap-4">
          <h3 className="font-medium">Fonts</h3>
          <div className="grid gap-2">
            <Label htmlFor="arabic-font">Arabic Font</Label>
            <Select value={settings.arabicFont} onValueChange={settings.setArabicFont}>
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
            <Select value={settings.translationFont} onValueChange={settings.setTranslationFont} disabled={!settings.showTranslation}>
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
              value={[settings.arabicFontSize]}
              onValueChange={(value) => settings.setArabicFontSize(value[0])}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="translation-size">Translation</Label>
            <Slider
              id="translation-size"
              min={0.8}
              max={2}
              step={0.1}
              value={[settings.translationFontSize]}
              onValueChange={(value) => settings.setTranslationFontSize(value[0])}
              disabled={!settings.showTranslation}
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
              value={[settings.lineHeight]}
              onValueChange={(value) => settings.setLineHeight(value[0])}
            />
          </div>
        </div>
      </div>
    )
  }

  return null;
}
