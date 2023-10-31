/*
Name: App.js
Date of creation: 10/14/2023 10:43 PM CST
Description: JS(react) for root domain.
*/
import './App.css';
/*
 function button_upload() {
    alert("I don't know how to upload yet lol")
  }

  function button_download() {
    alert("I don't know how to download yet lol")
  }
*/

async function start() {
  const response = await fetch("https://api.math-rad.com/start")
  document.getElementById("-startValue").innerHTML = await response.text()
}

async function upload() {
 alert("idk how to upload yet")
}

async function download() {
 alert("idk how to download yet")
}

function App(req) {
  return (
    <html>
      <div className="App">
        <header className="App-header">
          <body>
            <h1>math.rad</h1>
            <body className="alter" >
              <p>
                Hello! You've reached my website! Unfortunately, it is currently under development and I do not know when I will finish it. I do have plans and dreams for it, so one day it will be in use. I just wanted to "grab" this domain since I liked it.
              </p>
              <p>
                I chose math.rad rad because it represents how much I love math(it's pretty rad), and my passion for computer science by referencing a math library and indexing the rad(radians) method.
              </p>

              <p>
                Thank you for reading! One day this website will be in good use :)
              </p>
            </body>
            <body>
            </body>
          </body>
         
          <p>
            v2
          </p>

        </header>
        <div>
            <p>upload file</p>
            <input type="text" id="upload_name" placeholder="name assisoated with file" />
            <input type="file" id="upload_file"/>
            <button onClick={upload}>upload</button>
           
          </div>
          <div>
            <p>download file</p>
            <input type="text" id="download_name" placeholder="name assisoated with file" />
            <button onClick={download}>download</button>
          </div>
          <div>
            <p id="-startValue"></p>
            <button onClick={start}>start</button>
          </div>
      </div>
    </html>
  );
}
export default App;
