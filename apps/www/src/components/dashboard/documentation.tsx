"use client";

import { Button } from "~/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/ui/card";

export function Documentation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentation</CardTitle>
        <CardDescription>
          Check out our complete docs at the link below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline">Read more →</Button>
      </CardContent>
    </Card>
  );
}
