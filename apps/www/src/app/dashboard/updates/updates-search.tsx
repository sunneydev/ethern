"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "~/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";

interface UpdatesSearchProps {
  projects: string[];
}

export function UpdatesSearch({ projects }: UpdatesSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [inputUpdateName, setInputUpdateName] = useState<string>();
  const [inputProject, setInputProject] = useState<string>();
  const projectParams = searchParams.get("project")?.toString();

  const [{ inputProject: project, inputUpdateName: updateName }] = useDebounce(
    { inputUpdateName, inputProject },
    500,
    {
      equalityFn: (prev, next) =>
        prev.inputProject === next.inputProject &&
        prev.inputUpdateName === next.inputUpdateName,
    },
  );

  const { replace } = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();

    if (project !== "all" && project) {
      params.set("project", project);
      replace(`${pathname}?${params.toString()}`);
    }

    if (updateName) {
      params.set("update", updateName);
      replace(`${pathname}?${params.toString()}`);
    }
  }, [pathname, project, replace, updateName]);

  return (
    <div className="flex items-center gap-8">
      <div className="flex w-full items-center gap-0 rounded-md border border-white/10 bg-[#101010] px-4">
        <MagnifyingGlassIcon className="h-4 w-4 fill-current text-[#7F7F7F]" />
        <Input
          onChange={(e) => setInputUpdateName(e.target.value)}
          defaultValue={searchParams.get("updateName")?.toString()}
          name="update-name"
          className="w-full border-none bg-transparent text-xs outline-none placeholder:text-[#7F7F7F] focus-visible:ring-0"
          type="text"
          placeholder="Search Updates"
        />
      </div>
      <Select
        onValueChange={(val) => {
          if (val === "all") {
            replace(pathname);
            return;
          }

          setInputProject(val);
        }}
        name="project"
      >
        <SelectTrigger className="flex w-48 items-center justify-center gap-2">
          <SelectValue
            placeholder={projectParams ? projectParams : "All Projects"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
