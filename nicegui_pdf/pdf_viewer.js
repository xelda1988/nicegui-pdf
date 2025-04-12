import "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.min.mjs"
var { pdfjsLib } = globalThis;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.mjs';


function renderPage(page) {
    console.log('Page loaded');
    var scale = 1.5;
    var viewport = page.getViewport({scale: scale});

    // Prepare canvas using PDF page dimensions
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.promise.then(function () {
      console.log('Page rendered');
    });
};

  
function showPage(self, path, page_number) {

  var loadingTask = pdfjsLib.getDocument({url: path});
  loadingTask.promise.then(function(pdf) {
    console.log('PDF loaded');

    pdf.getPage(page_number).then(function(page) {
      self.$emit("change", page_number);
      renderPage(page);
    });
  }, function (reason) {
    // PDF loading error
    console.error(reason);
  });
};


export default {
    template: `
    <div>
      <canvas id="the-canvas"></canvas>
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
      show_page() {
        this.page_number = 1;
        showPage(this, this.path, this.page_number);
      },

      next_page(){
        this.page_number += 1;
        showPage(this, this.path, this.page_number);
      }
    },
  };