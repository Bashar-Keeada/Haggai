import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ImportCSVDialog = ({ open, onClose, workshopId, workshopTitle, onImportComplete }) => {
  const { language, isRTL } = useLanguage();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const txt = {
    sv: {
      title: 'Importera från Google Forms',
      subtitle: 'Ladda upp en CSV-fil exporterad från Google Forms',
      selectFile: 'Välj CSV-fil',
      dragDrop: 'eller dra och släpp här',
      selectedFile: 'Vald fil',
      import: 'Importera',
      importing: 'Importerar...',
      cancel: 'Avbryt',
      close: 'Stäng',
      success: 'Import klar!',
      imported: 'Importerade',
      errors: 'Fel',
      name: 'Namn',
      email: 'E-post',
      password: 'Lösenord',
      row: 'Rad',
      error: 'Fel',
      downloadTemplate: 'Ladda ner mall',
      instructions: 'Instruktioner',
      step1: '1. Exportera Google Forms-svar som CSV',
      step2: '2. Kolumnnamn mappas automatiskt (svenska, engelska, arabiska)',
      step3: '3. Minst "Namn" eller "full_name" kolumn krävs',
      step4: '4. Om e-post finns skapas automatiskt deltagarkonto med lösenord',
      supportedColumns: 'Kolumner som stöds',
      workshop: 'Workshop'
    },
    ar: {
      title: 'استيراد من Google Forms',
      subtitle: 'ارفع ملف CSV مُصدَّر من Google Forms',
      selectFile: 'اختر ملف CSV',
      dragDrop: 'أو اسحب وأفلت هنا',
      selectedFile: 'الملف المحدد',
      import: 'استيراد',
      importing: 'جاري الاستيراد...',
      cancel: 'إلغاء',
      close: 'إغلاق',
      success: 'تم الاستيراد!',
      imported: 'تم استيراد',
      errors: 'أخطاء',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      row: 'صف',
      error: 'خطأ',
      downloadTemplate: 'تحميل القالب',
      instructions: 'التعليمات',
      step1: '١. صدّر ردود Google Forms كملف CSV',
      step2: '٢. يتم تعيين أسماء الأعمدة تلقائياً (السويدية، الإنجليزية، العربية)',
      step3: '٣. يجب وجود عمود "الاسم" أو "full_name" على الأقل',
      step4: '٤. إذا وُجد البريد الإلكتروني، يتم إنشاء حساب مشارك بكلمة مرور تلقائياً',
      supportedColumns: 'الأعمدة المدعومة',
      workshop: 'ورشة العمل'
    },
    en: {
      title: 'Import from Google Forms',
      subtitle: 'Upload a CSV file exported from Google Forms',
      selectFile: 'Select CSV file',
      dragDrop: 'or drag and drop here',
      selectedFile: 'Selected file',
      import: 'Import',
      importing: 'Importing...',
      cancel: 'Cancel',
      close: 'Close',
      success: 'Import complete!',
      imported: 'Imported',
      errors: 'Errors',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      row: 'Row',
      error: 'Error',
      downloadTemplate: 'Download template',
      instructions: 'Instructions',
      step1: '1. Export Google Forms responses as CSV',
      step2: '2. Column names are mapped automatically (Swedish, English, Arabic)',
      step3: '3. At least "Name" or "full_name" column is required',
      step4: '4. If email exists, participant account with password is created automatically',
      supportedColumns: 'Supported columns',
      workshop: 'Workshop'
    }
  }[language] || {};

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setResults(null);
    } else {
      toast.error('Please select a CSV file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile);
      setResults(null);
    } else {
      toast.error('Please drop a CSV file');
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const url = workshopId 
        ? `${BACKEND_URL}/api/import/nominations?workshop_id=${workshopId}`
        : `${BACKEND_URL}/api/import/nominations`;

      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
        toast.success(`${txt.imported}: ${data.imported_count}`);
        if (onImportComplete) {
          onImportComplete(data);
        }
      } else {
        toast.error(data.detail || 'Import failed');
      }
    } catch (error) {
      toast.error('Import failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResults(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Upload className="h-5 w-5 text-haggai" />
            {txt.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Workshop info */}
          {workshopTitle && (
            <div className={`p-3 bg-haggai-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
              <span className="text-sm text-stone-500">{txt.workshop}:</span>
              <span className="font-medium text-haggai ml-2">{workshopTitle}</span>
            </div>
          )}

          {/* Instructions */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className={`p-4 ${isRTL ? 'text-right' : ''}`}>
              <h4 className="font-semibold text-blue-800 mb-2">{txt.instructions}</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>{txt.step1}</li>
                <li>{txt.step2}</li>
                <li>{txt.step3}</li>
                <li>{txt.step4}</li>
              </ul>
            </CardContent>
          </Card>

          {/* File upload area */}
          {!results && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                file ? 'border-green-400 bg-green-50' : 'border-stone-300 hover:border-haggai'
              }`}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="font-medium text-green-700">{txt.selectedFile}:</p>
                    <p className="text-green-600">{file.name}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setFile(null)}
                    className="text-stone-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-haggai font-medium hover:underline">{txt.selectFile}</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-stone-500 text-sm mt-2">{txt.dragDrop}</p>
                </>
              )}
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-4">
              {/* Summary */}
              <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Card className="flex-1 border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-700">{results.imported_count}</p>
                    <p className="text-sm text-green-600">{txt.imported}</p>
                  </CardContent>
                </Card>
                {results.error_count > 0 && (
                  <Card className="flex-1 border-red-200 bg-red-50">
                    <CardContent className="p-4 text-center">
                      <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-700">{results.error_count}</p>
                      <p className="text-sm text-red-600">{txt.errors}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Imported list */}
              {results.imported.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className={`font-semibold mb-3 ${isRTL ? 'text-right' : ''}`}>
                      {txt.imported} ({results.imported.length})
                    </h4>
                    <div className="max-h-60 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-stone-100">
                          <tr>
                            <th className={`p-2 ${isRTL ? 'text-right' : 'text-left'}`}>{txt.name}</th>
                            <th className={`p-2 ${isRTL ? 'text-right' : 'text-left'}`}>{txt.email}</th>
                            <th className={`p-2 ${isRTL ? 'text-right' : 'text-left'}`}>{txt.password}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.imported.map((item, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="p-2">{item.name}</td>
                              <td className="p-2">{item.email || '-'}</td>
                              <td className="p-2">
                                {item.password !== 'N/A - already exists or no email' ? (
                                  <code className="bg-stone-100 px-2 py-1 rounded text-xs">{item.password}</code>
                                ) : (
                                  <span className="text-stone-400 text-xs">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Errors */}
              {results.errors.length > 0 && (
                <Card className="border-red-200">
                  <CardContent className="p-4">
                    <h4 className={`font-semibold text-red-700 mb-3 ${isRTL ? 'text-right' : ''}`}>
                      {txt.errors} ({results.errors.length})
                    </h4>
                    <div className="max-h-40 overflow-y-auto">
                      {results.errors.map((err, idx) => (
                        <div key={idx} className="text-sm text-red-600 p-2 bg-red-50 rounded mb-1">
                          {txt.row} {err.row}: {err.error}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Actions */}
          <div className={`flex gap-3 pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
            {!results ? (
              <>
                <Button
                  onClick={handleImport}
                  disabled={!file || loading}
                  className="flex-1 bg-haggai hover:bg-haggai-dark"
                >
                  {loading ? txt.importing : txt.import}
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  {txt.cancel}
                </Button>
              </>
            ) : (
              <Button onClick={handleClose} className="flex-1 bg-haggai">
                {txt.close}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportCSVDialog;
