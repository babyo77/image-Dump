import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@react-hook/media-query";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useRef } from "react";
import { IUser } from "@/lib/models/userModel";
import { logout } from "@/action/logout";

function UserSettings({ loggedIn }: { loggedIn?: IUser | null }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const options = [
    {
      title: "Login",
      hidden: loggedIn?._id ? true : false,
      action: () => {
        router.push("/login");
      },
    },
    {
      title: "Go to profile",
      hidden: loggedIn?._id ? false : true,
      action: () => {
        router.push("/p");
        closeRef.current?.click();
      },
    },

    {
      title: "Logout",
      variant: "destructive",
      hidden: loggedIn?._id ? false : true,
      action: async () => {
        try {
          await logout();
          closeRef.current?.click();
          window.location.reload();
        } catch (error) {
          //@ts-expect-error:expected error
          toast.error(error.message);
        }
      },
    },
  ];

  const render = () => {
    return (
      <motion.div
        initial={{ filter: "blur(10px)", opacity: 0 }}
        animate={{ filter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 0.4 }}
        className=" w-full flex flex-col gap-2.5"
      >
        {options.map((options) => (
          <Button
            key={options.title}
            size={"sm"}
            onClick={options.action}
            variant={options.variant ? "destructive" : "default"}
            className={`w-full ${options.hidden ? "hidden" : ""}`}
          >
            {options.title}
          </Button>
        ))}
      </motion.div>
    );
  };
  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger className="flex items-center gap-2">
          <div className=" h-10 w-10 rounded-full overflow-hidden">
            <Image
              alt="profile-image"
              src={loggedIn ? loggedIn.image : "/notFound.jpg"}
              height={200}
              width={200}
              className=" h-[100%] w-[100%] object-cover"
            />
          </div>
        </DialogTrigger>
        <DialogContent className=" max-w-sm">
          <DialogHeader>
            <DialogTitle>Navigation</DialogTitle>
            <DialogDescription></DialogDescription>
            <DialogClose ref={closeRef} />
          </DialogHeader>
          {render()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger className="flex items-center gap-2">
        <div className=" h-10 w-10 rounded-full overflow-hidden">
          <Image
            alt="profile-image"
            src={loggedIn ? loggedIn.image : "/notFound.jpg"}
            height={200}
            width={200}
            className=" h-[100%] w-[100%] object-cover"
          />
        </div>
      </DrawerTrigger>
      <DrawerContent className=" max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription></DrawerDescription>
          {render()}
          <DrawerClose ref={closeRef} />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}

export default UserSettings;
