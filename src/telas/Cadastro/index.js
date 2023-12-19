import React, { useState } from "react";
import { View, Alert } from "react-native";
import Botao from "../../componentes/Botao";
import { EntradaTexto } from "../../componentes/EntradaTexto";
import estilos from "./estilos";
import { Alerta } from "../../componentes/Alerta";
import { alteraDados, verificaEntradaVazia } from "../../utils/comum";
import { entradas } from "./entradas";

import { cadastrar } from "../../servicos/auth";

export default function Cadastro({ navigation }) {
  const [dados, setDados] = useState({
    email: "",
    senha: "",
    confirmaSenha: "",
  });

  const [statusErro, setStatusErro] = useState("");
  const [mensagemError, setMensagemError] = useState("");

  function verificaSenhasIguais() {
    return dados.senha != dados.confirmaSenha
  }

  async function realizarCadastro() {
    if(verificaEntradaVazia(dados, setDados)) return
    if(dados.senha != dados.confirmaSenha) {
      setStatusErro(true)
      setMensagemError('As senhas não conferem')
      return
    }

    const resultado = await cadastrar(dados.email, dados.senha)
    if(resultado != 'sucesso') {
      setStatusErro(true)
      setMensagemError(resultado)
    }
  }

  return (
    <View style={estilos.container}>
      {entradas.map((entrada) => {
        return (
          <EntradaTexto
            key={entrada.id}
            {...entrada}
            value={dados[entrada.name]}
            onChangeText={(valor) =>
              alteraDados(entrada.name, valor, dados, setDados)
            }
            error={entrada.name != 'confirmaSenha' ? false : verificaSenhasIguais() && dados.confirmaSenha != ''}
          />
        );
      })}

      <Alerta
        mensagem={mensagemError}
        error={statusErro}
        setError={setStatusErro}
        duracao={5000}
      />

      <Botao onPress={() => realizarCadastro()}>CADASTRAR</Botao>
    </View>
  );
}
