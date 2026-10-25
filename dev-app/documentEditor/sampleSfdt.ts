/** A small document in the Syncfusion document format (SFDT), loaded with documentEditor.open() so no service is needed. */
export const sampleSfdt = JSON.stringify({
  sections: [{
    blocks: [
      { inlines: [{ text: 'Hello Document Editor', characterFormat: { bold: true, fontSize: 20 } }] },
      { inlines: [{ text: 'The quick brown fox jumps over the lazy dog.' }] },
      {
        inlines: [
          { hasFieldEnd: true, fieldType: 0 },
          { text: ' HYPERLINK "https://example.invalid/docs" ' },
          { fieldType: 2 },
          { text: 'Example link', characterFormat: { fontColor: '#0563c1', underline: 'Single' } },
          { fieldType: 1 }
        ]
      },
      { inlines: [{ text: 'Second paragraph with more words to search for fox.' }] }
    ],
    headersFooters: {},
    sectionFormat: {
      pageWidth: 612, pageHeight: 792, leftMargin: 72, rightMargin: 72, topMargin: 72, bottomMargin: 72,
      headerDistance: 36, footerDistance: 36
    }
  }],
  characterFormat: { fontSize: 11, fontFamily: 'Calibri' },
  paragraphFormat: {},
  background: { color: '#FFFFFFFF' },
  styles: [],
  lists: [],
  abstractLists: []
});
