"use client";

import { Footer } from "flowbite-react";

export function FooterComponent() {
    return (
        <Footer
            container
            className="bg-[#2D3F50] px-10 text-slate-100 relative z-50 rounded-none border-t-2"
        >
            <Footer.Copyright
                href="/home"
                by="PSU Calendar™"
                year={2024}
                className="text-white"
            />
            <Footer.LinkGroup>
                <Footer.Link href="/home" className="text-white">
                    Calendar
                </Footer.Link>
                <Footer.Link href="/Google" className="text-white">
                    Google
                </Footer.Link>
            </Footer.LinkGroup>
        </Footer>
    );
}
