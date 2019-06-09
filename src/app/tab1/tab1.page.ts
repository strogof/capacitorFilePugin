import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest } from '@angular/common/http';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
const { Filesystem } = Plugins;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private http: HttpClient,
    private fileOpener: FileOpener
  ) { }
  filePlugin() {
    const req = new HttpRequest(
      'GET',
      'https://ordinet.luigicurto.com:81/pdf/venditeSettimanali34.pdf', {
        responseType: 'blob',
        observe: 'events',
        reportProgress: true
      });
    this.http.request(req)
      .subscribe((event) => {
        switch (event.type) {
          case HttpEventType.DownloadProgress:
            break;
          // handle the response event received
          case HttpEventType.Response:
            // When getting the full response body
            console.log('venditeSettimanali34.pdf downloaded');
            const contFile: any = event.body;
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                Filesystem.writeFile({
                  data: result,
                  directory: FilesystemDirectory.Data ,
                  path: '/pdf/test.pdf'
              })
              .then(() => {
                  console.log('download test.pdf OK');
                  this.fileOpener.open(FilesystemDirectory.Data + '/pdf/test.pdf', 'application/pdf')
                  .then(() => {
                    console.log('File is opened');
                  })
                  .catch(e => {
                    console.log('Error opening file', e);
                  });
                });
            };
            reader.readAsDataURL(contFile);
            break;
        }
      },
        (error) => {
          console.log('download test.pdf failed');
        });
  }
  writeFile() {
    const req = new HttpRequest(
      'GET',
      'https://ordinet.luigicurto.com:81/dbImport_install.db', {
        responseType: 'blob',
        observe: 'events',
        reportProgress: true
      });
    this.http.request(req)
      .subscribe(async (event) => {
        switch (event.type) {
          case HttpEventType.DownloadProgress:
            break;
          // handle the response event received
          case HttpEventType.Response:
            // When getting the full response body
            console.log('ordiniFilesystem.db downloaded');
            const contFile: any = event.body;
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                Filesystem.writeFile({
                  data: result,
                  directory: FilesystemDirectory.Data,
                  path: 'ordiniFilesystem.db'
              })
              .then(() => {
                  console.log('install ordiniFilesystem OK');
                });
            };
            reader.readAsDataURL(contFile);
            break;
        }
      },
        (error) => {
          console.log('install ordiniFilesystem failed');
        });
  }
  readAsBinaryString(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = (event) => {
        resolve(reader.result as string);
      };
      reader.onerror = (event) => {
        reject(reader.error);
      };
      reader.readAsDataURL(file);
    });
  }
}
