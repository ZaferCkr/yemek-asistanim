import { Redirect } from 'expo-router';

export default function Index() {
  // TypeScript bazen yolu bulamazsa kızmasın diye 'as any' ekledik
  return <Redirect href={"/login" as any} />;
}