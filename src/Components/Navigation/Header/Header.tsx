import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Spacer,
  useToken,
} from "@chakra-ui/react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useAccount, useSignMessage, useNetwork } from "wagmi";
import { useRouter } from "next/router";

export default function Header() {
  const backgroundColor = useToken("colors", "brand.60");
  const [scrolled, setScrolled] = React.useState(false);
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { status } = useSession();
  const { signMessageAsync } = useSignMessage();
  const { push } = useRouter();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();

  const account = useAccount({
    onDisconnect() {
      console.log("Disconnected");
      push("/"); // Redirect the user after signing out
    },
  });

  useEffect(() => {
    console.log("inside check, status", status);
    console.log("inside check, status", isConnected);
    const handleAuth = async () => {
      const { message } = (await requestChallengeAsync({
        address: address as string,
        chainId: chain!.id,
      })) as { id: string; profileId: string; message: string };

      const signature = await signMessageAsync({ message });

      // redirect user after success authentication to '/user' page
      const { url } = (await signIn("moralis-auth", {
        message,
        signature,
        redirect: false,
        callbackUrl: "/oems", // take the user to the oem dashboard
      })) as { url: string };
      /**
       * instead of using signIn(..., redirect: "/user")
       * we get the url from callback and push it to the router to avoid page refreshing
       */
      push(url);
    };
    if (status === "unauthenticated" && isConnected) {
      console.log("inside initial check, status", status);
      console.log("inside initial check, status", isConnected);

      handleAuth();
    }
  }, [status, isConnected]);

  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      console.log(`Scrolled: ${isScrolled}`);
      setScrolled(isScrolled);
    };

    // Only add the event listener if window is defined (i.e., we're on the client side)
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      // Clean up the event listener when the component is unmounted
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <Flex
      as="nav"
      minWidth="max-content"
      className={styles.header}
      style={{
        backgroundColor: `rgba(10, 12, 14, 0.5)`, // Adjust the alpha value (0.8) as needed
        borderBottom: scrolled ? "1px solid #332018" : "none",
      }}
    >
      <Link href="/" shallow>
        <Box className={styles.yamato_logo}>
          <Image
            src="bloctrace-logo-long-light.svg"
            alt="BlocTrace Logo"
            width={2000}
            height={400}
          />
        </Box>
      </Link>
      <Spacer></Spacer>
      <ButtonGroup className={styles.nav_menu} variant="ghost" gap="2">
        <Link href="/oems" shallow>
          <Button
            color="brand.0"
            _hover={{
              borderColor: "brand.300",
              borderBottomWidth: "2px",
              borderRadius: "1px",
              transition: "ease-in-out 0.2s",
            }}
          >
            OEMS
          </Button>
        </Link>

        <Link href="/couriers" shallow>
          <Button
            color="brand.0"
            aria-current="page"
            _hover={{
              borderColor: "brand.300",
              borderBottomWidth: "2px",
              borderRadius: "0",
              transition: "ease-in-out 0.2s",
            }}
          >
            COURIERS
          </Button>
        </Link>
        <Link href="/product_makers" shallow>
          <Button
            color="brand.0"
            aria-current="page"
            _hover={{
              borderColor: "brand.300",
              borderBottomWidth: "2px",
              borderRadius: "0",
              transition: "ease-in-out 0.2s",
            }}
          >
            PRODUCT MAKERS
          </Button>
        </Link>

        <Link href="/retailers" shallow>
          <Button
            color="brand.0"
            _hover={{
              borderColor: "brand.300",
              borderBottomWidth: "2px",
              borderRadius: "0",
              transition: "ease-in-out 0.2s",
            }}
          >
            RETAILERS
          </Button>
        </Link>

        <Link
          href="https://github.com/Sahil24-lab/BlocTrace"
          target="_blank"
          rel="noopener noreferrer"
          shallow
        >
          <Button
            color="brand.0"
            _hover={{
              borderColor: "brand.300",
              borderBottomWidth: "2px",
              borderRadius: "0",
              transition: "ease-in-out 0.2s",
            }}
          >
            DOCS
          </Button>
        </Link>
      </ButtonGroup>
      <Spacer></Spacer>
      <Flex className={styles.connect}>
        <ConnectButton
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
        />
      </Flex>
    </Flex>
  );
}
