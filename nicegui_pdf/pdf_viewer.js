import "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.min.js"
import "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"


var __PDF_DOC,
    __CURRENT_PAGE,
    __TOTAL_PAGES,
    __PAGE_RENDERING_IN_PROGRESS = 0,
    PDFJS = window['pdfjs-dist/build/pdf'];

PDFJS.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js';

function showPDF(pdf_url, canvas, canvas_ctx) {
  $("#pdf-loader").show();

  PDFJS.getDocument({ url: pdf_url }).promise.then(function (pdf_doc) {
      __PDF_DOC = pdf_doc;
      __TOTAL_PAGES = __PDF_DOC.numPages;

      // Hide the pdf loader and show pdf container in HTML
      $("#pdf-loader").hide();
      $("#pdf-contents").show();
      $("#pdf-total-pages").text(__TOTAL_PAGES);

      // Show the first page
      showPage(1, canvas, canvas_ctx);
  }).catch(function (error) {
      // If error re-show the upload button
      $("#pdf-loader").hide();
      $("#upload-button").show();

      alert(error.message);
  });
}


function showPage(page_no, canvas, canvas_ctx) {
  __PAGE_RENDERING_IN_PROGRESS = 1;
  __CURRENT_PAGE = page_no;

  // Disable Prev & Next buttons while page is being loaded
  $("#pdf-next, #pdf-prev").attr('disabled', 'disabled');

  // While page is being rendered hide the canvas and show a loading message
  $("#pdf-canvas").hide();
  $("#page-loader").show();

  // Update current page in HTML
  $("#pdf-current-page").text(page_no);

  // Fetch the page
  __PDF_DOC.getPage(page_no).then(function (page) {
      // Get viewport of the page at required scale
      let viewport = page.getViewport({
          scale: 1,
      });

      // As the canvas is of a fixed width we need to set the scale of the viewport accordingly
      let scale = canvas.width / viewport.width;
      viewport = page.getViewport({
          scale: scale
      });

      // Set canvas height
      canvas.height = viewport.height;

      var renderContext = {
          canvasContext: canvas_ctx,
          viewport: viewport
      };

      // Render the page contents in the canvas
      page.render(renderContext).promise.then(function () {
          __PAGE_RENDERING_IN_PROGRESS = 0;

          // Re-enable Prev & Next buttons
          $("#pdf-next, #pdf-prev").removeAttr('disabled');

          // Show the canvas and hide the page loader
          $("#pdf-canvas").show();
          $("#page-loader").hide();

          // Return the text contents of the page after the pdf has been rendered in the canvas
          return page.getTextContent();
      }).then(function (textContent) {
          // Get canvas offset
          var canvas_offset = $("#pdf-canvas").offset();

          // Clear HTML for text layer
          $("#text-layer").html('');

          // Assign the CSS created to the text-layer element
          document.getElementById('text-layer').style.setProperty('--scale-factor', viewport.scale);
          $("#text-layer").css({ left: canvas_offset.left + 'px', top: canvas_offset.top + 'px'});

          // Pass the data to the method for rendering of text over the pdf canvas.
          PDFJS.renderTextLayer({
              textContentSource: textContent,
              container: $("#text-layer").get(0),
              viewport: viewport,
              textDivs: []
          });
      });
  });
}


export default {
    template: `
    <div id="pdf-main-container">
        <div id="pdf-loader">Loading document ...</div>
        <div id="pdf-contents">
            <div id="pdf-meta">
                <div id="pdf-buttons">
                    <button id="pdf-prev">Previous</button>
                    <button id="pdf-next">Next</button>
                    <button id="pdf-print">PRINT</button>
                </div>
                <div id="page-count-container">Page <div id="pdf-current-page"></div> of <div id="pdf-total-pages">
                    </div>
                </div>
            </div>
            <canvas id="pdf-canvas" width="800"></canvas>
            <div id="text-layer" class="textLayer"></div>
            <div id="page-loader">Loading page ...</div>
        </div>
    </div>
    `,
    props: {
      path: String,
      pdf: Object,
    },
    data() {
      return {
        num_pages: 0,
        page_number: 1,
        pdf: null,
      };
    },
    methods: {
      init() {
        var canvas = $('#pdf-canvas').get(0);
        var canvas_ctx = canvas.getContext('2d');
        
        showPDF(this.path, canvas, canvas_ctx);
        console.log("INIT");
      },

      show_page() {
        this.page_number = 1;
        // showPage();
      },

      next_page(){
        this.page_number += 1;
        // showPage();
      }
    },
  };