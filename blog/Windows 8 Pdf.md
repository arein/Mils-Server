{{{
    "title": "PDF Manipulation on Windows 8",
    "tags": ["pdf", "windows 8"],
    "category": "implementation",
    "date": "16-3-2014"
}}}

Adding a signature as a PNG image on Mac OS X was a breeze through Apple's PdfKit.

Unfortunately, Windows 8 does not provide out of the box PDF manipulation APIs.

Windows 8.1 only provides a Pdf to Png rendering API.

In order to meet our requirements, we reviewed the following libraries:
- Component One
- Foxit PDF
- PdfTron

Except Foxit PDF, none of the libraries was able to modify pdfs. Component One's solution is quite nice and allows to add non-transparent images. But we needed to add transparent images.

Foxit PDF provides the functionality but is extremely pricy. Hence, it was no option to us.

Therefore, we ended up manipulating the Pdf on the server side.