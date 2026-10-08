// shadcn resolves its `utils` alias here. The implementation lives in `./cn`, which is
// the `cn` package configured with this repo's type scale — see that file for what goes
// wrong when a component imports the unconfigured one from `"cn"` directly.
export { cn } from "@traiv/ui/lib/cn";
