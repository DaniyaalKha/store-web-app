'use client';

export default function Footer() {
      return (
        <footer className="mt-16 py-8 px-4 border-t border-border">
            <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} Daniyaal's Tech. All rights reserved.</p>
            </div>
        </footer>
    );
}