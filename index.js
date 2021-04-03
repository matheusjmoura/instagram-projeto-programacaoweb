window.addEventListener('load', start);

let formLogin = null;
let inputLogin = null;
let inputSenha = null;
let botaoEntrar = null;

function start() {
  formLogin = document.querySelector('form');
  inputLogin = document.getElementById('inputLogin');
  inputSenha = document.getElementById('inputSenha');
  botaoEntrar = document.getElementById('formLoginBotao');
  preventFormSubmit();
  login();
}

function preventFormSubmit() {
  function handleFormSubmit(event) {
    event.preventDefault();
  }
  formLogin.addEventListener('submit', handleFormSubmit);
}

function login() {
  botaoEntrar.addEventListener('click', postLogin);
}

async function postLogin() {
  try {
    const response = await axios.post('https://reqres.in/api/login', {
      email: 'eve.holt@reqres.in',
      password: 'cityslicka',
      // email: inputLogin.value,
      // password: inputSenha.value,
    });
    clear();
    showResults([`Usuário ${inputLogin.value} logado com sucesso.`]);
    randomUser(response.data.token);
  } catch (error) {
    clear();
    showResults('Usuário ou senha incorretos.');
    inputLogin.classList.add('erroLogin');
  } finally {
    document.getElementById('inputLogin').focus();
  }
}

function clear() {
  inputLogin.value = '';
  inputSenha.value = '';
}

function randomUser(token) {
  const botaoConsultar = botaoEntrar.cloneNode(true);
  botaoConsultar.setAttribute('id', 'formConsultarBotao');
  botaoConsultar.textContent = 'Consultar';
  botaoEntrar.remove();
  formLogin.insertBefore(botaoConsultar, inputSenha);
  inputLogin.placeholder = 'Digite sua pesquisa';
  inputSenha.style.visibility = 'hidden';
  botaoConsultar.addEventListener('click', getUser);
}

async function getUser(token) {
  let results = [];
  try {
    const response = await axios.get('https://randomuser.me/api/', {
      params: {
        results: 20,
        nat: inputLogin.value ? inputLogin.value : 'br',
        gender: inputLogin.value ? inputLogin.value : 'male',
      },
    });
    response.data.results &&
      response.data.results.forEach((pessoa) => {
        results.push(pessoa);
      });
  } catch (error) {
    results = 'Desculpe, não foi possível realizar essa ação.';
  } finally {
    showResults(results);
    document.getElementById('inputLogin').focus();
  }
}

function showResults(results) {
  const imgSmartphone = document.querySelector('.smartphone-demonstracao img');
  const smartphone = document.querySelector('.smartphone-demonstracao');
  document.querySelector('.smartphone-demonstracao h1') &&
    document.querySelector('.smartphone-demonstracao h1').remove();
  imgSmartphone && imgSmartphone.remove();
  const result = document.createElement('h1');
  result.classList.add('smartphone-result');
  Array.isArray(results)
    ? results.forEach((res, i) => {
        i === 0 && (result.innerHTML = 'Resultados:');
        const li = document.createElement('li');
        if (res.name) {
          li.innerHTML = `${res.name.first} ${res.name.last}`;
          li.style.listStyleImage = `url('${res.picture.thumbnail}')`;
        } else {
          li.innerHTML = res;
        }
        result.appendChild(li);
      })
    : error(result, results);
  smartphone.appendChild(result);
}

function error(result, erro) {
  result.innerHTML = 'ERRO:';
  const li = document.createElement('li');
  li.classList.add('error');
  li.innerHTML = erro;
  result.appendChild(li);
}
