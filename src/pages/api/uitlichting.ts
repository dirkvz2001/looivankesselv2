import supabase from '../../../utils/supabase';

export type Uitlichting = {
  id: string;
  titel: string;
  beschrijving: string;
};

export async function getAllUitlichtings(): Promise<Uitlichting[]> {
  const { data, error } = await supabase.from('uitlichtingvakken').select('*');

  if (error) {
    throw error;
  }

  return data.map((uitlichting) => {
    const {id, titel, beschrijving} = uitlichting;
    return {
        id, 
        titel,
        beschrijving,
    };
  });
}

export async function getUitlichting(titel: string): Promise<Uitlichting | null> {
  return (await getAllUitlichtings()).find((uitlichting) => uitlichting.titel === titel) ?? null;
}	