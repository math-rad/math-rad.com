/*
Name: App.js
Date of creation: 10/14/2023 10:43 PM CST
Description: JS(react) for root domain.
*/
import logo from './logo.svg';
import './App.css';

async function upload() {
  const name = prompt("What name would you like to save the file under?")
  var input = document.createElement('input');
  var file
  input.type = 'file';
  input.accept = ".txt"
  input.onchange = e => {
    file = e.target.files[0]
    input.remove()

    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name)

    fetch("https://api.math-rad.com/uploadv1", {
      "method": 'post',
      'body': formData
    }).then(response => {
      console.log(response.text)
    })


  }

  input.click();

}

function App() {
  return (
    <html>
      <div className="App">
        <header className="App-header">
          <body>
            <h1>math.rad</h1>

            <button onClick={upload}>upload file</button>
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
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    </html>

  );
}

export default App;
