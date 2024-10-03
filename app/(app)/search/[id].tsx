import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  Linking,
  ActivityIndicator,
  Button,
} from 'react-native';

interface Product {
  asin: string;
  name: string;
  url: string;
  image: string;
  final_price: number;
}

interface Search {
  id: string;
  query: string;
  created_at: string;
  status: string;
}

import { supabase } from '~/utils/supabase';

dayjs.extend(relativeTime);

export default function SearchResultScreen() {
  const { id } = useLocalSearchParams();
  const [search, setSearch] = useState<Search | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from('searches')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => setSearch(data));

    supabase
      .from('product_search')
      .select('*, products(*)')
      .eq('search_id', id)
      .then(({ data, error }) => {
        console.log(data, error);
        setProducts(data?.map((d) => d.products) as Product[] || []);
      });
  }, [id]);

  const startScraping = async () => {
    const { data, error } = await supabase.functions.invoke('scrape-start', {
      body: JSON.stringify({ record: search }),
    });
    console.log(data, error);
  };

  if (!search) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <View className="m-2 gap-2 rounded bg-white p-2 shadow-sm">
        <Text className="text-xl font-semibold">{search.query}</Text>
        <Text>{dayjs(search.created_at).fromNow()}</Text>
        <Text>{search.status}</Text>
        <Button title="Start scraping" onPress={startScraping} />
      </View>

      <FlatList
        data={products}
        contentContainerClassName="gap-2 p-2"
        keyExtractor={(item) => item.asin}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => Linking.openURL(item.url)}
            className="flex-row gap-2 bg-white p-3">
            <Image source={{ uri: item.image }} className="h-20 w-20" />
            <Text className="flex-1" numberOfLines={4}>
              {item.name}
            </Text>
            <Text>$ {item.final_price}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
