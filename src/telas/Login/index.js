import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import Botao from "../../componentes/Botao";
import { EntradaTexto } from "../../componentes/EntradaTexto";
import estilos from "./estilos";
import { logar } from "../../servicos/auth";
import { Alerta } from "../../componentes/Alerta";
import { auth } from "../../config/firebase";
import animacao_carregando from "../../../assets/animacao_carregando.gif";
import { alteraDados, verificaEntradaVazia } from "../../utils/comum";
import { entradas } from "./entradas";

export default function Login({ navigation }) {
  const [dados, setDados] = useState({
    email: "",
    senha: "",
  });

  const [statusErro, setStatusErro] = useState("");
  const [mensagemError, setMensagemError] = useState("");

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const estadoUsuario = auth.onAuthStateChanged((usuario) => {
      if (usuario) {
        navigation.replace("Principal");
      }
      setCarregando(false);
    });
    return () => estadoUsuario();
  }, []);

  

  async function realizarLogin() {
    if (verificaEntradaVazia(dados, setDados)) return;

    const resultado = await logar(dados.email, dados.senha);

    if (resultado == "erro") {
      setStatusErro(true);
      setMensagemError("E-mail ou senha não conferem");
      return;
    }
    navigation.replace("Principal");
  }

  if (carregando) {
    return (
      <View style={estilos.containerAnimacao}>
        <Image source={animacao_carregando} style={estilos.imagem} />
      </View>
    );
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
          />
        );
      })}

      <Alerta
        mensagem={mensagemError}
        error={statusErro}
        setError={setStatusErro}
        duracao={3600}
      />

      <Botao onPress={() => realizarLogin()}>LOGAR</Botao>
      <Botao
        onPress={() => {
          navigation.navigate("Cadastro");
        }}
      >
        CADASTRAR USUÁRIO
      </Botao>
    </View>
  );
}
