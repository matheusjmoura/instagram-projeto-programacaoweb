window.addEventListener('load', start);

let formLogin = null;
let inputLogin = null;
let inputSenha = null;
let botaoEntrar = null;
let botaoCadastrar = null;
let token = null;

function start() {
  formLogin = document.querySelector('form');
  inputLogin = document.getElementById('inputLogin');
  inputSenha = document.getElementById('inputSenha');
  botaoEntrar = document.getElementById('formLoginBotao');
  botaoCadastrar = document.getElementById('cadastreSe');
  preventFormSubmit();
  login();
}

function preventFormSubmit() {
  function handleFormSubmit(event) {
    event.preventDefault();
  }
  formLogin.addEventListener('submit', handleFormSubmit);
}

function reload() {
  document.location.reload(true);
}

function login() {
  function formCadastro() {
    const botaoCadastro = botaoEntrar.cloneNode(true);
    botaoCadastro.setAttribute('id', 'formCadastrarBotao');
    botaoCadastro.textContent = 'Cadastrar';
    botaoEntrar.remove();
    formLogin.insertBefore(botaoCadastro, document.querySelector('.separador'));
    botaoCadastro.addEventListener('click', postCadastro);
    document.querySelector('.cadastre-se').innerHTML =
      'Já possui uma conta? <a id="login" href="#">Entrar</a>';
    document.getElementById('login').addEventListener('click', reload);
    clearSuccess();
  }
  document.getElementById('cadastreSe').addEventListener('click', () => {
    !document.getElementById('formCadastrarBotao') && formCadastro();
  });
  botaoEntrar.addEventListener('click', postLogin);
}

function validarCampos() {
  if (!inputLogin.value) {
    showResults(['erro', 'Digite o usuário.']);
    inputLogin.classList.add('erroLogin');
    inputLogin.focus();
    inputSenha.classList.remove('erroLogin');
    return false;
  } else if (!inputSenha.value) {
    showResults(['erro', 'Digite a senha.']);
    inputSenha.classList.add('erroLogin');
    inputSenha.focus();
    inputLogin.classList.remove('erroLogin');
    return false;
  } else {
    inputLogin.classList.remove('erroLogin');
    inputSenha.classList.remove('erroLogin');
    return true;
  }
}

async function postCadastro() {
  if (validarCampos()) {
    try {
      const response = await axios.post('https://reqres.in/api/register', {
        email: 'eve.holt@reqres.in',
        password: 'pistol',
        // email: inputLogin.value,
        // password: inputSenha.value,
      });
      showResults([
        'sucesso',
        `Usuário ${inputLogin.value} cadastrado com sucesso.`,
      ]);
      token = response.data.token;
      randomUser();
      clearSuccess();
    } catch (error) {
      clear();
      showResults(['erro', 'Erro ao cadastrar usuário.']);
      inputLogin.classList.add('erroLogin');
    } finally {
      inputLogin.focus();
    }
  }
}

async function postLogin() {
  if (validarCampos()) {
    try {
      const response = await axios.post('https://reqres.in/api/login', {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
        // email: inputLogin.value,
        // password: inputSenha.value,
      });
      showResults([
        'sucesso',
        `Usuário ${inputLogin.value} logado com sucesso.`,
      ]);
      token = response.data.token;
      randomUser();
      clearSuccess();
    } catch (error) {
      clear();
      showResults(['erro', 'Usuário e/ou senha incorretos.']);
      inputLogin.classList.add('erroLogin');
    } finally {
      clear();
      inputLogin.focus();
    }
  }
}

function clear() {
  inputLogin.value = '';
  inputSenha.value = '';
  inputLogin.classList.remove('erroLogin');
  inputSenha.classList.remove('erroLogin');
}

function clearSuccess() {
  clear();
  document.querySelector('.separador').remove();
  document.querySelector('.entrar-com-facebook').remove();
  document.querySelector('.esqueceu-senha').remove();
}

function randomUser() {
  const botaoConsultar = botaoEntrar.cloneNode(true);
  botaoConsultar.setAttribute('id', 'formConsultarBotao');
  botaoConsultar.textContent = 'Consultar';
  botaoEntrar.remove();
  formLogin.insertBefore(botaoConsultar, inputSenha);
  inputLogin.placeholder = 'Digite sua pesquisa';
  inputSenha.style.visibility = 'hidden';
  document.querySelector('.cadastre-se').innerHTML =
    'Deseja finalizar a sessão? <a id="logout" href="#">Sair</a>';
  document.getElementById('logout').addEventListener('click', reload);
  botaoConsultar.addEventListener('click', getUser);
}

async function getUser() {
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
  const layout = document.createElement('h1');
  layout.classList.add('smartphone-result');
  const result = document.createElement('h1');
  result.classList.add('smartphone-result-text');
  document.querySelector('.smartphone-demonstracao h1') &&
    document.querySelector('.smartphone-demonstracao h1').remove();
  imgSmartphone && imgSmartphone.remove();
  Array.isArray(results) && results[0] !== 'erro' && results[0] !== 'sucesso'
    ? results.forEach((res, i) => {
        i === 0 && (result.innerHTML = 'Resultados');
        const li = document.createElement('li');
        if (res.name) {
          li.innerHTML = `${res.name.first} ${res.name.last}`;
          li.style.listStyleImage = `url('${res.picture.thumbnail}')`;
        } else {
          li.innerHTML = res;
        }
        result.appendChild(li);
      })
    : alert(result, results);
  layout.appendChild(result);
  smartphone.appendChild(layout);
}

function alert(result, messages) {
  if (messages[0] === 'erro') {
    result.innerHTML = 'Algo deu errado!';
    const li = document.createElement('li');
    result.classList.add('error');
    li.innerHTML = messages[1];
    result.appendChild(li);
  } else {
    result.innerHTML = 'Sucesso!';
    const li = document.createElement('li');
    result.classList.add('success');
    li.innerHTML = messages[1];
    result.appendChild(li);
  }
}
