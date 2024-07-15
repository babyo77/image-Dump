import { logout } from "@/action/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserContext } from "@/store/context";
import { useRouter } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import { toast } from "sonner";
export function Settings() {
  const { setLoader } = useUserContext();
  const { user } = useUserContext();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      setLoader(true);
      await logout();
      router.push(`/p/${user?.username}`);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className=" cursor-pointer hover:text-zinc-300 transition-all duration-300">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="3"
                width="15"
                height="2"
                rx="1"
                fill="currentColor"
              ></rect>
              <rect
                y="11"
                width="15"
                height="2"
                rx="1"
                fill="currentColor"
              ></rect>
              <circle
                cx="10"
                cy="4"
                r="2"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              ></circle>
              <circle
                cx="6"
                cy="12"
                r="2"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              ></circle>
            </svg>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mb-6 mr-7 bg-primary-foreground/95 rounded-md">
          <DropdownMenuItem
            onClick={() => window.open("https://tanmayo7.vercel.app")}
          >
            More by @babyo7_
            <DropdownMenuShortcut>
              <MdArrowOutward />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Log out
            <DropdownMenuShortcut>
              <IoIosLogOut />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
