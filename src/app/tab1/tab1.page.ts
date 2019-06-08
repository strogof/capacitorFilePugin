import { Component } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest } from '@angular/common/http';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
const { Filesystem } = Plugins;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private file: File,
    private http: HttpClient,
  ) {}
  filePlugin() {
    const req = new HttpRequest(
      'GET',
      'https://ordinet.luigicurto.com:81/dbImport_install.db', {
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
            console.log('ordiniFilePlugin.db downloaded');
            const contFile: any = event.body;
            this.file.writeFile(
              this.file.applicationStorageDirectory,
              'ordiniFilePlugin.db',
              contFile,
              { replace: true }
            )
              .then(() => {
                console.log('install ordiniFilePlugin OK');
              });
            break;
        }
      },
        (error) => {
          console.log('install ordiniFilePlugin failed');
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
            const reader = new FileReader;
            reader.onload = () => {
                var base64String = reader.result as string;
                Filesystem.writeFile({
                  data: base64String,
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
}
