window.addEventListener('WebComponentsReady', function() {
  // var we = window.we;
  var Overlay = window.Overlay;

  /**
   * Show text in overlay
   */
  var WeModalPrototype = Object.create(HTMLElement.prototype);
  WeModalPrototype.createdCallback = function createdCallback() {
    this.addEventListener('click', this.showOverlay);
  };

  WeModalPrototype.showOverlay = function showOverlay(ev) {
    ev.preventDefault();

    this.orverlay = new Overlay({
      html: this.dataset.content,
      onAppend: function() {},
      onRemove: function() {}
    });

    return false;
  }

  document.registerElement('we-overlay-btn', {
    prototype: WeModalPrototype
  });

  /**
   * Get one form from server and show in overlay
   */
  var WeFormModalPrototype = Object.create(HTMLElement.prototype);
  WeFormModalPrototype.createdCallback = function createdCallback() {

    this.addEventListener('click', this.showOverlay);
  };

  WeFormModalPrototype.getForm = function getForm(cb) {
    if (!cb) cb = function(){};

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 ) {
        if (xhttp.status == 200) {
          cb( null, xhttp.responseText );
        } else {
          cb(xhttp);
        }
      }
    };
    xhttp.open('GET', this.dataset.url, true);
    xhttp.send();

    return xhttp;
  };

  WeFormModalPrototype.showOverlay = function showOverlay(ev) {
    ev.preventDefault();
    var btn = this;

    var body = document.querySelector('body');
    body.classList.add('modal-open');


    this.getForm(function (err, data) {
      if (err) return console.log(err);

      this.formHTML = data;

      this.overlay = new Overlay({
        html: '<div class="modal-area">'+this.formHTML+'</div>',
        onAppend: function() {
          var form = document.querySelector('body > div.overlay form');

          form.addEventListener('submit', function(ev){
            ev.preventDefault();

            var $form = $(form);
            var formData = {};
            $form.serializeArray().forEach(function (d) {
              formData[d.name] = d.value;
            });

            $.ajax({
              url: form.action,
              method: form.method,
              dataType: 'json',
              headers: { Accept: 'application/json' },
              data: formData
            }).then(function (r) {

              btn.dispatchEvent(new CustomEvent('we:modal:form:submit:success', {
                detail: r,
                bubbles: true,
                cancelable: true
              }));

              btn.overlay.close();
            }).fail(function (err) {
              console.log('>>err>>', err);
            });

            return false;
          }.bind(this));
        }.bind(this),
        onRemove: function() {
          body.classList.remove('modal-open');
        }
      });
    }.bind(this));

    return false;
  }

  document.registerElement('we-overlay-form-btn', {
    prototype: WeFormModalPrototype
  });
});
