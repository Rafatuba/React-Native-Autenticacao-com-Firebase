import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  AuthErrorCodes,
  signInWithEmailAndPassword,
} from "firebase/auth";

function errosFirebase(error) {
  let mensagem = "";
  switch (error.code) {
    case AuthErrorCodes.EMAIL_EXISTS:
      mensagem = "E-mail já cadastrado.";
      break;
    case AuthErrorCodes.INVALID_EMAIL:
      mensagem = "E-mail inválido";
      break;
    case AuthErrorCodes.WEAK_PASSWORD:
      mensagem = "A senha deve possuir no mínimo 6 caracteres";
      break;
    default:
      mensagem = "Erro desconhecido. Tente novamente mais tarde!";
  }
  return mensagem;
}

export async function cadastrar(email, senha) {
  const resultado = await createUserWithEmailAndPassword(auth, email, senha)
    .then((dadosDoUsuario) => {
      console.log(dadosDoUsuario);
      return "sucesso";
    })
    .catch((error) => {
      console.log(error);
      return errosFirebase(error);
    });
  return resultado;
}

export async function logar(email, senha) {
  const resultado = await signInWithEmailAndPassword(auth, email, senha)
    .then((dadosDoUsuario) => {
      console.log(dadosDoUsuario);
      return "sucesso";
    })
    .catch((error) => {
      console.log(error);
      return "erro"
    });
  return resultado;
}
