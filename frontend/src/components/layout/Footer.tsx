import React from 'react';
import Link from 'next/link';
import { MapPin, Github, Twitter, ExternalLink, MessageCircle } from 'lucide-react';

const footerLinks = {
  platform: [
    { name: 'About', href: '/about' },
    { name: 'How to Play', href: '/guide' },
    { name: 'Roadmap', href: '/roadmap' },
    { name: 'Whitepaper', href: '/whitepaper' },
  ],
  community: [
    { name: 'Discord', href: '#', icon: MessageCircle },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'GitHub', href: '#', icon: Github },
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api' },
    { name: 'Smart Contracts', href: '#', icon: ExternalLink },
    { name: 'Stacks Explorer', href: '#', icon: ExternalLink },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">P2E Platform</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              The ultimate Play-to-Earn gaming platform built on Stacks blockchain.
              Own virtual land, build structures, compete in challenges, and earn real rewards.
            </p>
            <div className="flex space-x-4">
              {footerLinks.community.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={item.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center"
                      target={item.icon ? '_blank' : undefined}
                      rel={item.icon ? 'noopener noreferrer' : undefined}
                    >
                      {item.name}
                      {Icon && <Icon className="w-3 h-3 ml-1" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 P2E Gaming Platform. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span>Built on</span>
                <a
                  href="https://stacks.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 font-medium"
                >
                  Stacks
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span>Secured by</span>
                <a
                  href="https://bitcoin.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-400 hover:text-accent-300 font-medium"
                >
                  Bitcoin
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
