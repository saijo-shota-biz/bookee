import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createDBClient } from "~/uitl/db.server";
import { Env } from "~/types";
import { users } from "~/schema/users";
import { json, useLoaderData } from "@remix-run/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const userList = await createDBClient((context.env as Env).DB)
    .select()
    .from(users)
    .all();

  return json({ users: userList });
};

export default function AdminIndexRoute() {
  const { users } = useLoaderData<typeof loader>();
  return (
    <Tabs defaultValue="users">
      <TabsList>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="journals">Journals</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>CreatedAt</TableHead>
                  <TableHead>UpdatedAt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.provider}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>{user.updatedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="journals">
        <ul>
          <li>test</li>
        </ul>
      </TabsContent>
    </Tabs>
  );
}
