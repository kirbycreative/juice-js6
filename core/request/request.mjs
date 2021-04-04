function createRequest() {

    var isIE8 = window.XDomainRequest ? true : false;
    if (window.XMLHttpRequest) {
        return isIE8 ? new window.XDomainRequest() : new XMLHttpRequest();
    } else {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }

}

class Request {

    options = {};

    reqData = null;

    constructor(url, options = {}) {

        const self = this;
        self.url = url;
        self.options = options;

    }

    data(data, dataType = 'formdata') {
        if (!this.reqData) this.reqData = new FormData();
        for (var prop in data) {
            this.reqData.append(prop, data[prop]);
        }
        return this;
    }

    headers(headers) {
        if (!this.reqHeaders) this.reqHeaders = [];
        for (var name in headers) {
            this.reqHeaders.push([name, headers[name]])
        }
        return this;
    }

    async send(method) {


        const xhr = createRequest();

        xhr.open( method, this.url, true );

        if (this.reqHeaders) {
            this.reqHeaders.map((header) => xhr.setRequestHeader.apply(xhr, header));
        }

        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = function () {
                var state = xhr.readyState;
                var responseType = xhr.responseType || 'text';
                var resp = responseType == 'text' ? xhr.responseText : xhr.response;
                //console.log( state, xhr.status, resp );
                if (state == 4) {

                    if (xhr.status >= 400) {
                        //Catch Error
                        reject(resp);
                        return false;
                    }

                    //Successful Req
                    return resolve(resp);
                }
            }
            xhr.send(self.reqData);
        });


    }

    get() {
        return this.send('GET');
    }
    post() {
        return this.send('POST');
    }
    head() {
        return this.send('HEAD');
    }
    put() {
        return this.send('PUT');
    }

    processData(data) {
        this.data = new FormData();
        for (var prop in data) {
            this.data.append(prop, data[prop]);
        }

    }
}



export { Request as default }