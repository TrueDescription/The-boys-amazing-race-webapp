"use client";

import { Login } from "@/pages/signin";
import { RiddlePage } from "@/components/ui/riddle";
import { Task } from "@/components/ui/task";
import { useRouter } from "next/router";


export default function Home() {
  // const router = useRouter();

  const routeLoginSuccess = () => {
    // Route to the desired page after login
  };
  return (
    <main>
      <Login/>
      {/* <RiddlePage/> */}
      {/* <Task/> */}
    </main>
  );
}
