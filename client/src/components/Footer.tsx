
"use client";

import { Footer } from "flowbite-react";

export function FooterComponent() {
  return (
    <Footer container className="bg-[#222831] px-10">
      <Footer.Copyright href="/home" by="PSU Calendar™" year={2024} />
      <Footer.LinkGroup>
        <Footer.Link href="/home">Calendar</Footer.Link>
        <Footer.Link href="/Google">Google</Footer.Link>

      </Footer.LinkGroup>
    </Footer>
  );
}
