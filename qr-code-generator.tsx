import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Image, Type, Upload, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Rest of the component code remains exactly the same, just removed LinkIcon from imports
const QRCodeGenerator = () => {
  // State for QR code settings
  const [settings, setSettings] = useState({
    url: '',
    title: '',
    showTitle: false,
    centerType: 'none',
    centerText: '',
    centerImage: null,
    centerImageUrl: '',
    qrColor: '#000000',
    backgroundColor: '#FFFFFF',
    dotStyle: 'square',
    downloadFormat: 'png',
    showUrlInImage: false
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('qrCodeSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    try {
      const settingsToSave = { ...settings };
      // Remove the actual image file from storage, only keep the URL
      if (settingsToSave.centerImage) {
        delete settingsToSave.centerImage;
      }
      localStorage.setItem('qrCodeSettings', JSON.stringify(settingsToSave));
      setShowSaveAlert(true);
      setTimeout(() => setShowSaveAlert(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({
          ...prev,
          centerImage: reader.result,
          centerImageUrl: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock QR code generation
  const mockQrCode = (
    <div className="w-64 h-64 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center relative">
      <div className="grid grid-cols-7 gap-1 p-4" style={{ color: settings.qrColor }}>
        {Array(7).fill().map((_, i) => (
          Array(7).fill().map((_, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-6 h-6 ${
                settings.dotStyle === 'square' ? 'rounded-none' :
                settings.dotStyle === 'rounded' ? 'rounded-md' : 'rounded-full'
              }`}
              style={{ backgroundColor: settings.qrColor }}
            />
          ))
        ))}
      </div>
      {settings.centerType === 'text' && settings.centerText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color: settings.qrColor }}>
            {settings.centerText}
          </span>
        </div>
      )}
      {settings.centerType === 'image' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {(settings.centerImage || settings.centerImageUrl) && (
            <img 
              src={settings.centerImage || settings.centerImageUrl} 
              alt="Center Logo" 
              className="w-12 h-12 object-contain"
            />
          )}
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">QR Code Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>URL to encode</Label>
              <Input
                type="url"
                placeholder="Enter URL"
                value={settings.url}
                onChange={(e) => setSettings(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showTitle}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showTitle: checked }))}
                />
                <Label>Show Title</Label>
              </div>
              {settings.showTitle && (
                <Input
                  type="text"
                  placeholder="Enter title"
                  value={settings.title}
                  onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Center Element</Label>
              <Select 
                value={settings.centerType}
                onValueChange={(value) => setSettings(prev => ({ ...prev, centerType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select center element" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
              
              {settings.centerType === 'text' && (
                <Input
                  type="text"
                  placeholder="Enter center text"
                  value={settings.centerText}
                  onChange={(e) => setSettings(prev => ({ ...prev, centerText: e.target.value }))}
                />
              )}

              {settings.centerType === 'image' && (
                <div className="space-y-4">
                  <Tabs defaultValue="upload">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">Upload Image</TabsTrigger>
                      <TabsTrigger value="url">Image URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                    </TabsContent>
                    <TabsContent value="url" className="space-y-2">
                      <Input
                        type="url"
                        placeholder="Enter image URL"
                        value={settings.centerImageUrl}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          centerImageUrl: e.target.value,
                          centerImage: null
                        }))}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>QR Code Style</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">QR Color</Label>
                  <Input
                    type="color"
                    value={settings.qrColor}
                    onChange={(e) => setSettings(prev => ({ ...prev, qrColor: e.target.value }))}
                    className="h-10 w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm">Background</Label>
                  <Input
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(e) => setSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="h-10 w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dot Style</Label>
              <Select 
                value={settings.dotStyle}
                onValueChange={(value) => setSettings(prev => ({ ...prev, dotStyle: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dot style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Download Settings</Label>
              <Select 
                value={settings.downloadFormat}
                onValueChange={(value) => setSettings(prev => ({ ...prev, downloadFormat: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="svg">SVG</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showUrlInImage}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showUrlInImage: checked }))}
                />
                <Label>Include URL in image</Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
              <Button variant="outline" onClick={saveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            {settings.showTitle && settings.title && (
              <h3 className="text-xl font-semibold">{settings.title}</h3>
            )}
            {mockQrCode}
            {settings.showUrlInImage && settings.url && (
              <p className="text-sm text-gray-500 mt-2 text-center">{settings.url}</p>
            )}
          </div>
        </div>

        {showSaveAlert && (
          <Alert className="mt-4">
            <AlertDescription>
              Settings saved successfully!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
