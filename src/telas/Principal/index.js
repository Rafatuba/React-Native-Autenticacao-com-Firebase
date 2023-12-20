import React, { useEffect, useState } from "react";
import { View, Text, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import Cabecalho from "../../componentes/Cabecalho";
import Produto from "../../componentes/Produtos";
import estilos from "./estilos";
import { auth } from "../../config/firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { BotaoProduto } from "../../componentes/BotaoProduto";
import { pegarProdutos, pegarProdutosTempoReal } from "../../servicos/firestore";

export default function Principal({ navigation }) {
  const dadosUsuario = auth.currentUser.email;
  const partes = dadosUsuario.split("@");
  const emailUsuario = partes[0];
  const [produtos, setProdutos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function carregarDadosProdutos() {
    setRefreshing(true);
    const produtosFirestore = await pegarProdutos();
    setProdutos(produtosFirestore);
    setRefreshing(false);
  }

  useEffect(() => {
    carregarDadosProdutos();

    pegarProdutosTempoReal(setProdutos)
  }, []);

  return (
    <View style={estilos.container}>
      <Cabecalho navigation={navigation} />
      <Text style={estilos.texto}>Usuário: {emailUsuario}</Text>

      <ScrollView
        style={{ width: "100%" }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={carregarDadosProdutos}
          />
        }
      >
        {produtos?.map((produto) => {
          return (
            <TouchableOpacity key={produto.id} onPress={() => navigation.navigate('DadosProduto', produto)}>
              <Produto
                nome={produto.nome}
                preco={produto.preco}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <BotaoProduto onPress={() => navigation.navigate("DadosProduto")} />
    </View>
  );
}
