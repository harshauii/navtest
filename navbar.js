// navbar.js
import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const navbarHTML = `
<style>
        .page-container {
  margin-left: 130px;
  margin-right: 130px;
}

@media (max-width: 768px) {
    .page-container {
        margin-left: 3px;
        margin-right: 3px;
    }
}

       :root {
            --primary-900: #37be72;
            --secondary-900: #1A1A1A;
            --surface-100: #F8F9FA;
            --text-primary: #1A1A1A;
            --text-inverse: #FFFFFF;
            --transition: cubic-bezier(0.33, 1, 0.68, 1);
            --shadow-lg: 0 24px 48px -12px rgba(0,0,0,0.18);
            --radius-2xl: 24px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'IBM Plex Sans', inter, system-ui, -apple-system, sans-serif, font-family: '', sans-serif;;
            line-height: 1.6;
        }

        .carousel-container {
            max-width: 1920px;
            margin: 0 auto;
            margin-top: 80px;
            position: relative;
            overflow: hidden;
            border-radius: var(--radius-2xl);
            isolation: isolate;
        }

        .carousel-track {
            display: flex;
            transition: transform 1s var(--transition);
        }

        .carousel-slide {
            position: relative;
            min-width: 100%;
            aspect-ratio: 16/9;
            overflow: hidden;
        }

        .slide-media {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center top;
            
        }

        .slide-content {
            position: absolute;
            bottom: 12%;
            left: 8%;
            max-width: min(600px, 45%);
            color: var(--text-primary);
            z-index: 2;
            background: rgba(255,255,255,0.9);
            padding: 2rem;
            border-radius: var(--radius-2xl);
            box-shadow: var(--shadow-lg);
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.8s var(--transition) 0.2s;
 font-family: 'IBM Plex Sans', sans-serif;
        }

        .slide-title {
            font-family: 'Manrope', sans-serif;
            font-weight: 800;
            font-size: clamp(2rem, 4vw + 1rem, 4rem);
            line-height: 1.1;
            margin-bottom: 1.5rem;
            letter-spacing: -0.03em;
            text-wrap: balance;
        }

        .slide-description {
            font-size: clamp(1rem, 1.2vw + 0.5rem, 1.25rem);
            margin-bottom: 2.5rem;
            opacity: 0.9;
            max-width: 32ch;
        }

        .slide-cta {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1.25rem 2.5rem;
            background: var(--primary-900);
            color: var(--text-inverse);
            border-radius: 100px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s var(--transition);
        }

        .carousel-controls {
            position: absolute;
            bottom: 8%;
            right: 8%;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 24px;
            z-index: 3;
        }

        .controls-group {
            display: flex;
            gap: 1rem;
        }

        .control-button {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            border: none;
            background: rgba(255,255,255,0.9);
            backdrop-filter: blur(12px);
            cursor: pointer;
            transition: all 0.3s var(--transition);
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .pagination {
            display: flex;
            gap: 1rem;
            position: relative;
            right: 28px; /* Perfect centering offset */
        }

        .pagination-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(0,0,0,0.2);
            cursor: pointer;
            transition: all 0.3s var(--transition);
        }

        .pagination-dot.active {
            background: var(--primary-900);
            transform: scale(1.4);
        }

        @media (max-width: 1024px) {
            .carousel-slide {
                aspect-ratio: 3/4;
            }
            
            .slide-content {
                max-width: 80%;
                left: 5%;
                bottom: 10%;
                padding: 1.5rem;
            }
            
            .carousel-controls {
                bottom: 15%;
                right: 5%;
            }
            
            .pagination {
                right: 24px; /* Adjusted offset */
            }
        }

        @media (max-width: 640px) {
            .slide-content {
                max-width: 90%;
                left: 5%;
                bottom: 5%;
                padding: 1.25rem;
            }
            
            .slide-title {
                font-size: clamp(1.75rem, 6vw, 2.5rem);
            }
            
            .carousel-controls {
                bottom: 10%;
                right: 5%;
                gap: 20px;
            }
            
            .control-button {
                width: 48px;
                height: 48px;
            }
            
            .pagination {
                right: 20px; /* Mobile offset */
            }
        }

        .carousel-slide.active .slide-content {
            opacity: 1;
            transform: translateY(0);
        }
        @media (max-width: 768px) {
            .desktop-only { display: none !important; }
            .mobile-menu-button { display: block !important; }
        }
        @media (min-width: 769px) {
            .mobile-only { display: none !important; }
        }
    </style>

<header style="background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.12); height: 72px; position: fixed; top: 0; left: 0; width: 100%; z-index: 100;">
    <nav style="max-width: 1440px; margin: 0 auto; padding: 0 20px; height: 100%; display: flex; justify-content: space-between; align-items: center;">
        <a href="dashboard.html" style="display: flex; align-items: center;">
            <img src="Syncskill.png" alt="Logo" style="height: 28px;">
        </a>
        <div class="desktop-only" style="display: flex; align-items: center; gap: 40px;">
            <!-- Mega Menu -->
            <div style="position: relative;" 
                onmouseenter="const btn = this.querySelector('button'); const m = this.querySelector('.mega-menu'); const rect = btn.getBoundingClientRect(); m.style.top = rect.bottom + 5 + 'px'; m.style.opacity = '1'; m.style.transform = 'translate(-50%, 0)'; m.style.pointerEvents = 'auto';"
                onmouseleave="const m = this.querySelector('.mega-menu'); m.style.opacity = '0'; m.style.transform = 'translate(-50%, 8px)'; m.style.pointerEvents = 'none';">
                <button style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; background: transparent; border: none; cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);" 
                        onmouseover="this.style.background='#f8f9fa'" 
                        onmouseout="this.style.background='transparent'">
                    <span style="font-family: 'Inter', system-ui, sans-serif; font-size: 15px; font-weight: 500; color: #333333; letter-spacing: 0.2px;">Learning Paths</span>
                    <svg style="width: 18px; height: 18px; color: #4d4d4d; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M6 9l6 6 6-6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="mega-menu" style="position: fixed; top: 0; left: 50%; width: 800px; background: #fff; border-radius: 16px; box-shadow: 0 24px 48px rgba(0,0,0,0.12); padding: 32px; opacity: 0; transform: translate(-50%,8px); transition: all 0.8s cubic-bezier(0.4,0,0.2,1); pointer-events: none;">
                    <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px;">
                        <div>
                            <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e9ecef;">
                                <h3 style="font-size: 14px; font-weight: 700; color: #2d3436; letter-spacing: 0.25px; margin: 0; text-transform: uppercase;">Career Accelerators</h3>
                            </div>
                            <ul style="list-style: none; padding: 0; margin: 0; display: grid; gap: 12px;">
                                <li><a href="testing.html" style="display: flex; align-items: center; padding: 12px 16px; border-radius: 8px; background: linear-gradient(95deg, #f8f9fa 0%, #ffffff 100%); border: 1px solid #f1f3f5; text-decoration: none; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.transform='translateX(4px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.05)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'"><div style="width: 32px; height: 32px; background: #6366f1; border-radius: 6px; margin-right: 12px; display: flex; align-items: center; justify-content: center;"><svg style="width: 16px; height: 16px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div><div><div style="font-size: 14px; font-weight: 600; color: #2d3436;">Data Science Pro</div><div style="font-size: 12px; color: #6c757d; margin-top: 4px;">12 Courses · 98 Hours</div></div></a></li>
                                <!-- Add more items as needed -->
                            </ul>
                        </div>
                        <div>
                            <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e9ecef;">
                                <h3 style="font-size: 14px; font-weight: 700; color: #2d3436; letter-spacing: 0.25px; margin: 0; text-transform: uppercase;">Certifications</h3>
                            </div>
                            <ul style="list-style: none; padding: 0; margin: 0; display: grid; gap: 12px;">
                                <li><a href="#" style="display: flex; align-items: center; padding: 12px 16px; border-radius: 8px; background: #ffffff; border: 1px solid #f1f3f5; text-decoration: none; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);" onmouseover="this.style.background='#f8f9fa'; this.style.borderColor='#e9ecef'" onmouseout="this.style.background='#ffffff'; this.style.borderColor='#f1f3f5'"><div style="width: 32px; height: 32px; background: #10b981; border-radius: 6px; margin-right: 12px;"></div><div><div style="font-size: 14px; font-weight: 600; color: #2d3436;">Cloud Architect</div><div style="font-size: 12px; color: #6c757d; margin-top: 4px;">AWS · Azure · GCP</div></div></a></li>
                            </ul>
                        </div>
                        <div>
                            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; padding: 24px; color: white;">
                                <div style="font-size: 12px; font-weight: 700; margin-bottom: 8px; opacity: 0.9;">FEATURED PROGRAM</div>
                                <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 12px 0;">GenAI Mastery</h3>
                                <p style="font-size: 14px; opacity: 0.9; margin-bottom: 24px; line-height: 1.5;">Master LLMs, Diffusion Models, and Production Deployment</p>
                                <button style="width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; font-weight: 600; cursor: pointer; transition: all 0.25s ease;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">Explore Program</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Profile Menu -->
            <div class="profile-menu" style="position: relative;">
                <div class="profile-trigger" onclick="toggleDropdown()" style="display: flex; align-items: center; gap: 12px; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); background: transparent;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'">
                    <img id="userAvatar" src="https://via.placeholder.com/36" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0;">
                    <span id="userName" style="font-weight: 500; color: #1e293b; font-size: 14px; position: relative; padding-right: 20px;">Loading...<span style="position: absolute; right: 0; top: 50%; transform: translateY(-50%); transition: transform 0.2s ease; font-size: 18px;">▾</span></span>
                </div>
                <div class="profile-dropdown" style="position: absolute; right: 0; top: calc(100% + 8px); width: 280px; background: #ffffff; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); padding: 24px; opacity: 0; transform: translateY(-10px); visibility: hidden; transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); z-index: 1000;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img id="dropdownAvatar" src="https://via.placeholder.com/60" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #e2e8f0; margin-bottom: 16px; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <div id="dropdownName" style="font-weight: 600; font-size: 18px; color: #1e293b; margin-bottom: 4px; line-height: 1.4;">Loading...</div>
                        <div id="dropdownEmail" style="font-size: 14px; color: #64748b; margin-bottom: 16px; word-break: break-all;">Loading...</div>
                    </div>
                    <div style="height: 1px; background: #f1f5f9; margin: 16px 0;"></div>
                    <div class="logout-btn" onclick="logout()" style="padding: 12px; text-align: center; border-radius: 8px; background: #fff; border: 1px solid #f1f5f9; color: #dc2626; font-weight: 500; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px;" onmouseover="this.style.background='#fef2f2'; this.style.borderColor='#fecaca'" onmouseout="this.style.background='#fff'; this.style.borderColor='#f1f5f9'">
                        <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        <span>Sign Out</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- Mobile Menu Button -->
        <button class="mobile-menu-button" id="mobileMenuButton" style="display: none; padding: 8px; border-radius: 8px; border: none; background: transparent; transition: transform 0.2s ease, background 0.2s ease;" onmouseover="this.style.background='rgba(0,0,0,0.05)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='transparent'; this.style.transform='scale(1)'">
            <svg style="width: 24px; height: 24px; color: #4b5563;" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>
        <!-- Mobile Menu -->
        <div id="mobileMenu" style="position: fixed; top: 0; right: 0; bottom: 0; width: 85vw; max-width: 300px; background: #ffffff; display: flex; flex-direction: column; z-index: 1000; transform: translateX(100%); box-shadow: -4px 0 16px rgba(0,0,0,0.1);">
            <div style="flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 24px 16px;">
                <div style="display: flex; justify-content: flex-end; margin-bottom: 24px;">
                    <button id="mobileMenuClose" style="padding: 8px; border-radius: 8px; border: none; background: transparent; transition: background 0.2s ease, transform 0.2s ease;" onmouseover="this.style.background='rgba(0,0,0,0.05)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='transparent'; this.style.transform='scale(1)'">
                        <svg style="width: 24px; height: 24px; color: #4b5563;" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 24px;">
                    <div style="display: flex; flex-direction: column; gap: 24px;">
                        <h3 onclick="(function(c){c.style.display=c.style.display==='flex'?'none':'flex'})(this.nextElementSibling)" style="font-size: 16px; font-weight: 700; color: #2d3436; margin: 0; padding: 12px 0; letter-spacing: 0.5px; text-transform: uppercase; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                            <span>Popular Courses</span>
                            <span style="font-size: 18px; line-height: 1;">+</span>
                        </h3>
                        <div style="display: none; flex-direction: column; gap: 12px; padding: 8px 0;">
                            <a href="testing.html" style="display: flex; align-items: center; padding: 12px 16px; border-radius: 8px; background: linear-gradient(95deg, #f8f9fa 0%, #ffffff 100%); border: 1px solid #f1f3f5; text-decoration: none; transition: all 0.25s cubic-bezier(0.4,0,0.2,1);" onmouseover="this.style.transform='translateX(4px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.05)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
                                <div style="width: 24px; height: 24px; background: #6366f1; border-radius: 6px; margin-right: 12px;"></div>
                                <div><div style="font-size: 14px; font-weight: 600; color: #2d3436;">Data Science Pro</div><div style="font-size: 12px; color: #6c757d; margin-top: 4px;">12 Courses · 98 Hours</div></div>
                            </a>
                        </div>
                    </div>
                    <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
                        <h3 onclick="(function(c){c.style.display=c.style.display==='flex'?'none':'flex'})(this.nextElementSibling)" style="font-size: 16px; font-weight: 700; color: #2d3436; margin: 0; padding: 12px 0; letter-spacing: 0.5px; text-transform: uppercase; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                            <span>Certifications</span>
                            <span style="font-size: 18px; line-height: 1;">+</span>
                        </h3>
                        <div style="display: none; flex-direction: column; gap: 12px; padding: 8px 0;">
                            <a href="#" style="display: flex; align-items: center; padding: 12px 16px; border-radius: 8px; background: linear-gradient(95deg, #f8f9fa 0%, #ffffff 100%); border: 1px solid #f1f3f5; text-decoration: none; transition: all 0.25s cubic-bezier(0.4,0,0.2,1);" onmouseover="this.style.transform='translateX(4px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.05)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
                                <div style="width: 24px; height: 24px; background: #6366f1; border-radius: 6px; margin-right: 12px;"></div>
                                <div><div style="font-size: 14px; font-weight: 600; color: #2d3436;">Cloud Architect</div><div style="font-size: 12px; color: #6c757d; margin-top: 4px;">AWS · Azure · GCP</div></div>
                            </a>
                        </div>
                    </div>
                    <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; padding: 16px; color: white;">
                            <div style="font-size: 12px; font-weight: 700; opacity: 0.9; margin-bottom: 8px;">FEATURED PROGRAM</div>
                            <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">GenAI Mastery</h3>
                            <p style="font-size: 14px; opacity: 0.9; margin: 0 0 16px 0; line-height: 1.4;">Master LLMs, Diffusion Models, and Production Deployment</p>
                            <button style="width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; font-weight: 600; cursor: pointer; transition: all 0.25s ease;" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">Explore Program</button>
                        </div>
                    </div>
                </div>
            </div>
            <div style="flex-shrink: 0; border-top: 1px solid #f1f5f9; padding: 16px; background: #ffffff; box-shadow: 0 -4px 12px rgba(0,0,0,0.05); z-index: 1002;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
                    <img id="mobileUserAvatar" src="https://via.placeholder.com/56" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0;">
                    <div style="flex-grow: 1; min-width: 0;">
                        <div id="mobileUserName" style="font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Loading...</div>
                        <div id="mobileUserEmail" style="font-size: 14px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Loading...</div>
                    </div>
                </div>
                <div onclick="logout()" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: linear-gradient(to right, #fff1f2, #ffe4e6); border-radius: 8px; color: #dc2626; font-weight: 500; cursor: pointer; border: 1px solid #fecaca;">
                    <svg style="width: 20px; height: 20px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <span>Sign Out</span>
                </div>
            </div>
        </div>
    </nav>
</header>
`;

document.body.insertAdjacentHTML('afterbegin', navbarHTML);

const elements = {
    mobileMenu: document.getElementById('mobileMenu'),
    mobileMenuButton: document.getElementById('mobileMenuButton'),
    mobileMenuClose: document.getElementById('mobileMenuClose'),
    userAvatar: document.getElementById('userAvatar'),
    mobileUserAvatar: document.getElementById('mobileUserAvatar'),
    userName: document.getElementById('userName'),
    dropdownAvatar: document.getElementById('dropdownAvatar'),
    dropdownName: document.getElementById('dropdownName'),
    dropdownEmail: document.getElementById('dropdownEmail'),
    mobileUserName: document.getElementById('mobileUserName'),
    mobileUserEmail: document.getElementById('mobileUserEmail')
};

const updateUserProfile = (user) => {
    if (!user) return;
    const fallbackAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    const displayName = user.displayName || user.email?.split('@')[0] || 'User';
    const email = user.email || 'No email provided';
    const photoURL = user.photoURL || fallbackAvatar;

    elements.userName.textContent = displayName;
    elements.dropdownName.textContent = displayName;
    elements.mobileUserName.textContent = displayName;
    elements.dropdownEmail.textContent = email;
    elements.mobileUserEmail.textContent = email;
    [elements.userAvatar, elements.dropdownAvatar, elements.mobileUserAvatar].forEach(img => {
        img.src = photoURL;
        img.onerror = () => img.src = fallbackAvatar;
    });
};

let dropdownVisible = false;
window.toggleDropdown = () => {
    const dropdown = document.querySelector('.profile-dropdown');
    dropdown.style.opacity = dropdownVisible ? 0 : 1;
    dropdown.style.transform = dropdownVisible ? 'translateY(-10px)' : 'translateY(0)';
    dropdown.style.visibility = dropdownVisible ? 'hidden' : 'visible';
    dropdownVisible = !dropdownVisible;
};

document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-menu')) {
        dropdownVisible = false;
        document.querySelector('.profile-dropdown').style.opacity = 0;
        document.querySelector('.profile-dropdown').style.transform = 'translateY(-10px)';
        document.querySelector('.profile-dropdown').style.visibility = 'hidden';
    }
});

const toggleMobileMenu = () => {
    const isOpen = elements.mobileMenu.style.transform === 'translateX(0px)';
    elements.mobileMenu.style.transform = isOpen ? 'translateX(100%)' : 'translateX(0)';
};

elements.mobileMenuButton.addEventListener('click', toggleMobileMenu);
elements.mobileMenuClose.addEventListener('click', toggleMobileMenu);

document.addEventListener('click', (e) => {
    if (!elements.mobileMenu.contains(e.target) && !elements.mobileMenuButton.contains(e.target) && window.innerWidth <= 768) {
        elements.mobileMenu.style.transform = 'translateX(100%)';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && window.innerWidth <= 768) {
        elements.mobileMenu.style.transform = 'translateX(100%)';
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        elements.mobileMenu.style.transform = 'translateX(100%)';
    }
});

window.logout = async () => {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error during logout. Please try again.');
    }
};

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        updateUserProfile(user);
    }
});
