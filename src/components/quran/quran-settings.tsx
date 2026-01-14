
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
import { Separator } from '../ui/separator';

const allowedTranslations = [
  { id: 'en.sahih', name: 'Sahih International (English)' },
  { id: 'en.hilali', name: 'Hilali & Khan (English)' },
  { id: 'ur.junagarhi', name: 'Junagarhi (Urdu)' },
];


export function QuranSettings({ allTranslations, allReciters, settingType }: { allTranslations: TranslationEdition[], allReciters: TranslationEdition[], settingType: 'translations' | 'fonts' | 'audio' }) {
  const settings = useQuranSettings();

  const filteredTranslations = allTranslations.filter(t => allowedTranslations.some(at => at.id === t.identifier));

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
                <ScrollArea className="h-auto">
                  {allowedTranslations.map(trans => (
                      <DropdownMenuCheckboxItem
                          key={trans.id}
                          checked={settings.selectedTranslations.includes(trans.id)}
                          onCheckedChange={(checked) => {
                              settings.setSelectedTranslations(prev => 
                                  checked ? [...prev, trans.id] : prev.filter(t => t !== trans.id)
                              );
                          }}
                      >
                          {trans.name}
                      </DropdownMenuCheckboxItem>
                  ))}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  if (settingType === 'audio') {
    return (
      <div className="grid gap-4">
        <h3 className="font-medium">Reciter</h3>
          <Select value={settings.selectedReciter} onValueChange={settings.setSelectedReciter}>
            <SelectTrigger>
                <SelectValue placeholder="Select a reciter" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className='h-64'>
                {allReciters.map(reciter => (
                    <SelectItem key={reciter.identifier} value={reciter.identifier}>
                        {reciter.englishName}
                    </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
      </div>
    );
  }

  if (settingType === 'fonts') {
    return (
       <div className="grid gap-6 p-4">
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
                  <SelectItem value="'Lateef', serif">Lateef</SelectItem>
                  <SelectItem value="'Tajawal', sans-serif">Tajawal</SelectItem>
                  <SelectItem value="'Cairo', sans-serif">Cairo</SelectItem>
                  <SelectItem value="'Almarai', sans-serif">Almarai</SelectItem>
                  <SelectItem value="'Scheherazade New', serif">Scheherazade New</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="translation-font">English Font</Label>
            <Select value={settings.translationFont} onValueChange={settings.setTranslationFont} disabled={!settings.showTranslation}>
              <SelectTrigger id="translation-font">
                  <SelectValue placeholder="Select English Font" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                  <SelectItem value="'Cormorant Garamond', serif">Cormorant Garamond</SelectItem>
                  <SelectItem value="'Lora', serif">Lora</SelectItem>
                  <SelectItem value="'Lato', sans-serif">Lato</SelectItem>
                  <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                  <SelectItem value="'Merriweather', serif">Merriweather</SelectItem>
                  <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
                  <SelectItem value="'EB Garamond', serif">EB Garamond</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid gap-2">
            <Label htmlFor="urdu-font">Urdu Font</Label>
            <Select value={settings.urduFont} onValueChange={settings.setUrduFont} disabled={!settings.showTranslation}>
              <SelectTrigger id="urdu-font">
                  <SelectValue placeholder="Select Urdu Font" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="'Noto Nastaliq Urdu', serif">Noto Nastaliq Urdu</SelectItem>
                  <SelectItem value="'Amiri', serif">Amiri</SelectItem>
                  <SelectItem value="'Scheherazade New', serif">Scheherazade New</SelectItem>
                  <SelectItem value="'Lateef', serif">Lateef</SelectItem>
                  <SelectItem value="'Almarai', sans-serif">Almarai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />
        
        <div className="grid gap-4">
            <h3 className="font-medium">Font Weight</h3>
            <div className="flex items-center justify-between">
                <Label htmlFor="arabic-bold">Bold Arabic Text</Label>
                <Switch id="arabic-bold" checked={settings.isArabicBold} onCheckedChange={settings.setIsArabicBold} />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="translation-bold">Bold English Text</Label>
                <Switch id="translation-bold" checked={settings.isTranslationBold} onCheckedChange={settings.setIsTranslationBold} disabled={!settings.showTranslation} />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="urdu-bold">Bold Urdu Text</Label>
                <Switch id="urdu-bold" checked={settings.isUrduBold} onCheckedChange={settings.setIsUrduBold} disabled={!settings.showTranslation} />
            </div>
        </div>

        <Separator />
        
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
        <Separator />
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
