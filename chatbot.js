// Chatbot Logic für Goldankauf-Prozess
// Regelbasierter Chatbot, der Fragen zum Prozess beantwortet
// Integriert mit n8n Webhook für erweiterte KI-Funktionen

import { sendToN8NWebhook } from './supabase.js';

// ============================================
// Chatbot Knowledge Base
// ============================================
const chatbotKnowledge = {
    // Begrüßungen
    greetings: [
        'hallo', 'hi', 'hey', 'guten tag', 'guten morgen', 'guten abend',
        'was kann', 'was machst', 'hilf', 'hilfe'
    ],
    
    // Dankesäußerungen
    thanks: {
        keywords: ['danke', 'dankeschön', 'danke schön', 'vielen dank', 'vielen danke', 'thanks', 'thank you', 'thx', 'bedanke', 'bedankt'],
        response: 'Gerne doch. Melden Sie sich bitte, wenn ich noch etwas für Sie tun kann.'
    },
    
    // Prozessschritte
    processSteps: {
        keywords: ['schritt', 'prozess', 'ablauf', 'verfahren', 'phase', 'stadium'],
        responses: [
            'Der Goldankauf-Prozess umfasst 19 Hauptschritte:',
            '1. Kontaktanbahnung mit Seller/Intermediaries',
            '2. Buyer-Placement',
            '3. KYC/AML/Sanktions-/Embargoprüfung',
            '4. Chain-of-Custody Dokumentation',
            '5. SPA-Erstellung/Signatur',
            '6. Re-Identifizierung (nur bei Hallmark >5 Jahre)',
            '7. Vorab-Dokumente 72h vor Versand',
            '8. Lufttransport (versichert, Zollversiegelung)',
            '9. Zollbereich Frankfurt/Main: Vorprüfung',
            '10. Sicherheitslogistik',
            '11. Ankunft Pforzheim: Annahmebestätigung',
            '12. Fire Assay + optional Second Assay',
            '13. Verbindlicher Assay Report',
            '14. Preisfestlegung (LBMA Fixing Bezug)',
            '15. Zahlung innerhalb vertraglicher Frist',
            '16. Ownership Transfer',
            '17. Raffination zu 999,9',
            '18. Lagerung/Abholung Buyer',
            '19. Abschlussdokumentation'
        ]
    },
    
    // Dokumente
    documents: {
        keywords: ['dokument', 'papier', 'unterlage', 'nachweis', 'zertifikat', 'beleg'],
        responses: [
            'Erforderliche Dokumente variieren je nach Prozessschritt:',
            '• KYC/AML: KYC-Formular, Ausweiskopie, Firmenregisterauszug, Sanktionsprüfung',
            '• SPA: Sales and Purchase Agreement, Signierte SPA, Anhänge',
            '• Vor Versand (72h): Proforma Invoice, COO, Ownership, Packing List, Assay Report, AWB, Export Permit, Customs Declaration, Tax Receipt, Insurance, Free&Clear Declaration',
            '• Transport: Transportvertrag, Versicherungspolice, Zollversiegelungsnachweis',
            '• Zoll: Zollanmeldung, Importbeauftragter Bestätigung, EUSt-Handling Dokumente',
            '• Assay: Fire Assay Report, Second Assay Report (optional), Labor-Zertifikat',
            '• Zahlung: Zahlungsbestätigung, Bankbeleg, Zahlungsnachweis',
            'Alle Dokumente können pro Schritt in der App hochgeladen werden.'
        ]
    },
    
    // KYC/AML
    kyc: {
        keywords: ['kyc', 'aml', 'compliance', 'sanktion', 'embargo', 'due diligence', 'prüfung'],
        responses: [
            'KYC/AML ist ein kritischer Schritt im Goldankauf-Prozess:',
            '• KYC (Know Your Customer): Identitätsprüfung des Verkäufers',
            '• AML (Anti-Money-Laundering): Geldwäsche-Prüfung',
            '• Sanktionsprüfung: Überprüfung gegen internationale Sanktionslisten',
            '• Embargo-Check: Prüfung auf Embargos',
            '• Chain-of-Custody: Nachweis der Besitzkette',
            'Diese Prüfungen müssen vor dem SPA-Abschluss abgeschlossen sein.'
        ]
    },
    
    // Zoll
    customs: {
        keywords: ['zoll', 'customs', 'import', 'einfuhr', 'frankfurt', 'eust', 'steuer'],
        responses: [
            'Zollverfahren in Frankfurt/Main:',
            '• Vorprüfung durch Zoll vor Ankunft',
            '• Importbeauftragter muss beauftragt werden',
            '• Aufschubkonto für EUSt-Handling',
            '• Zollversiegelung während Transport',
            '• Alle Versanddokumente müssen 72h vor Versand vorliegen',
            '• Customs Declaration, Export Permit, COO erforderlich'
        ]
    },
    
    // Assay
    assay: {
        keywords: ['assay', 'feuerprobe', 'qualität', 'reinheit', '999', 'labor', 'prüfung'],
        responses: [
            'Assay-Verfahren:',
            '• Fire Assay: Standard-Feuerprobe durch zertifiziertes Labor',
            '• Optional: Second Assay für unabhängige Bestätigung',
            '• Verbindlicher Assay Report als Grundlage für Preisfestlegung',
            '• Ziel: Raffination zu 999,9 Reinheit',
            '• Assay-Ergebnisse bestimmen den finalen Preis basierend auf LBMA Fixing'
        ]
    },
    
    // Zahlung
    payment: {
        keywords: ['zahlung', 'payment', 'preis', 'lbma', 'fixing', 'bezahlung', 'frist'],
        responses: [
            'Zahlungsprozess:',
            '• Preisfestlegung basiert auf LBMA Fixing und Assay-Ergebnissen',
            '• Zahlung muss innerhalb der im SPA vereinbarten Frist erfolgen',
            '• Zahlungsbestätigung und Bankbeleg müssen dokumentiert werden',
            '• Ownership Transfer erfolgt nach Zahlung',
            '• Alle Zahlungsdokumente werden in der App gespeichert'
        ]
    },
    
    // Risiken
    risks: {
        keywords: ['risiko', 'risiken', 'risk', 'gefahr', 'gefahren', 'problem', 'probleme', 'schwierigkeit', 'schwierigkeiten', 'herausforderung', 'herausforderungen', 'welche risiken', 'was für risiken', 'welche gefahren'],
        responses: [
            'Im Goldankauf-Prozess bestehen folgende Hauptrisiken:',
            '• Compliance-Risiko: KYC/AML/Sanktionsprüfung - Verzögerungen oder Ablehnung bei unvollständigen Prüfungen',
            '• Zollrisiko: Verzögerungen bei der Zollabfertigung, Steuerprobleme, fehlende Dokumente',
            '• Logistikrisiko: Transportrisiken, Diebstahl, Beschädigung während des Transports',
            '• Qualitätsrisiko: Abweichungen bei Assay-Ergebnissen, nicht erwartete Reinheit',
            '• Zahlungsrisiko: Verzögerungen bei Zahlungen, Liquiditätsprobleme, Währungsrisiken',
            '',
            'Alle Risiken können im Risiko-Register der App dokumentiert, bewertet (Schweregrad und Wahrscheinlichkeit) und mit Mitigations-Maßnahmen versehen werden.'
        ]
    },
    
    // Hallmark
    hallmark: {
        keywords: ['hallmark', 'stempel', 'tafelgold', 'gestempelt', 're-identifizierung'],
        responses: [
            'Hallmark (gestempeltes Tafelgold):',
            '• Unterschied zwischen Doré Gold Bars und gestempeltem Tafelgold',
            '• Stempelalter ist wichtig: <=5 Jahre oder >5 Jahre',
            '• Bei Hallmark >5 Jahre: Re-Identifizierung durch zertifizierten Assayer erforderlich',
            '• Re-Identifizierung ist ein separater Prozessschritt (Schritt 6)',
            '• Bei Hallmark <=5 Jahre oder Doré: Re-Identifizierung entfällt'
        ]
    },
    
    // Allgemeine Fragen
    general: {
        keywords: ['was ist', 'was bedeutet', 'erkläre', 'wie funktioniert', 'was passiert'],
        responses: [
            'Das Goldankauf-Prozess-Management-System verwaltet den vollständigen Prozess von der Kontaktanbahnung bis zur Raffination und Abholung.',
            'Sie können Geschäfte erstellen, Prozessschritte verfolgen, Dokumente hochladen, Risiken dokumentieren und den gesamten Prozess exportieren.',
            'Stellen Sie spezifische Fragen zu Prozessschritten, Dokumenten, Risiken oder Compliance.'
        ]
    },
    
    // Fallback - direkter und hilfreicher
    fallback: 'Entschuldigung, ich habe Ihre Frage nicht vollständig verstanden. Können Sie die Frage präziser formulieren? Ich kann Ihnen bei Fragen zu Prozessschritten, Dokumenten, KYC/AML, Zoll, Assay, Zahlung oder Risikomanagement helfen.'
};

// ============================================
// Chatbot Functions
// ============================================
export function initializeChatbot() {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    const container = document.getElementById('chatbot-container');
    
    if (!toggleBtn || !container) return;
    
    // Toggle chatbot
    toggleBtn.addEventListener('click', () => {
        container.classList.toggle('active');
        if (container.classList.contains('active')) {
            input.focus();
        }
    });
    
    // Close chatbot
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.classList.remove('active');
        });
    }
    
    // Send message on button click
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            sendMessage();
        });
    }
    
    // Send message on Enter key
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

async function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');
    
    if (!input || !messagesContainer) return;
    
    const question = input.value.trim();
    if (!question) return;
    
    // Add user message
    addMessage(question, 'user');
    input.value = '';
    
    // Show typing indicator
    const typingIndicator = showTypingIndicator();
    
    try {
        // First, get rule-based response as fallback
        const ruleBasedResponse = getBotResponse(question);
        console.log('Rule-based response:', ruleBasedResponse);
        
        // Try n8n webhook for AI-powered responses (if LLM is connected)
        let response = null;
        try {
            // Get current context for better LLM responses
            const context = {
                user_question: question,
                current_deal: window.currentDeal ? {
                    deal_no: window.currentDeal.deal_no,
                    country: window.currentDeal.country,
                    commodity_type: window.currentDeal.commodity_type,
                    status: window.currentDeal.status
                } : null,
                rule_based_suggestion: Array.isArray(ruleBasedResponse) ? ruleBasedResponse.join('\n') : ruleBasedResponse
            };
            
            const n8nResponse = await sendToN8NWebhook(question, 'chatbot', context);
            
            console.log('n8n response received:', n8nResponse);
            
            // Check if n8n returned a valid, non-empty response
            // Also check that it's not just a generic message or the fallback message
            if (n8nResponse && n8nResponse.response && n8nResponse.response.trim()) {
                const n8nResponseText = n8nResponse.response.trim();
                const isGenericFallback = n8nResponseText.includes('nicht vollständig verstanden') || 
                                         n8nResponseText.includes('nicht verstanden') ||
                                         n8nResponseText.length < 20;
                
                if (n8nResponseText.length > 20 && !isGenericFallback) {
                    response = n8nResponseText;
                    console.log('Using n8n response:', response);
                } else {
                    console.log('n8n returned generic or too short response, using rule-based');
                }
            } else {
                console.log('n8n returned empty or invalid response, using rule-based');
            }
        } catch (webhookError) {
            console.warn('n8n webhook error, using rule-based response:', webhookError);
        }
        
        // If n8n didn't provide a valid response, use rule-based fallback
        if (!response) {
            response = ruleBasedResponse;
            console.log('Using rule-based response:', response);
        }
        
        removeTypingIndicator(typingIndicator);
        addMessage(response, 'bot');
    } catch (error) {
        removeTypingIndicator(typingIndicator);
        addMessage('Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.', 'bot');
        console.error('Error in sendMessage:', error);
    }
}

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;
    
    const time = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    
    if (type === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="ti ti-user"></i>
                <div>
                    <p>${escapeHtml(text)}</p>
                </div>
            </div>
            <div class="message-time">${time}</div>
        `;
    } else {
        // Bot message - can contain HTML
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="ti ti-robot"></i>
                <div>${formatBotResponse(text)}</div>
            </div>
            <div class="message-time">${time}</div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function formatBotResponse(text) {
    // Convert array or string to formatted HTML
    if (Array.isArray(text)) {
        return text.map(item => {
            if (item.startsWith('•') || item.match(/^\d+\./)) {
                return `<p style="margin: 0.25rem 0;">${escapeHtml(item)}</p>`;
            }
            return `<p>${escapeHtml(item)}</p>`;
        }).join('');
    }
    return `<p>${escapeHtml(text)}</p>`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getBotResponse(question) {
    const lowerQuestion = question.toLowerCase().trim();
    
    console.log('getBotResponse called with:', question);
    console.log('lowerQuestion:', lowerQuestion);
    
    // Check for thanks FIRST (before other checks)
    if (chatbotKnowledge.thanks.keywords.some(k => lowerQuestion.includes(k))) {
        console.log('Matched thanks');
        return chatbotKnowledge.thanks.response;
    }
    
    // Check for greetings - direkter
    if (chatbotKnowledge.greetings.some(g => lowerQuestion.includes(g))) {
        console.log('Matched greetings');
        return 'Gerne helfe ich Ihnen weiter! Stellen Sie mir Fragen zu Prozessschritten, Dokumenten, Risiken, Zoll, Assay oder Zahlung. Wie kann ich Ihnen helfen?';
    }
    
    // Check risks FIRST (before other keywords that might match) - prioritize specific risk questions
    const riskMatch = chatbotKnowledge.risks.keywords.some(k => {
        const matches = lowerQuestion.includes(k);
        if (matches) {
            console.log('Risk keyword matched:', k);
        }
        return matches;
    });
    
    if (riskMatch) {
        console.log('Returning risks response');
        return chatbotKnowledge.risks.responses;
    }
    
    // Check process steps
    if (chatbotKnowledge.processSteps.keywords.some(k => lowerQuestion.includes(k))) {
        return chatbotKnowledge.processSteps.responses;
    }
    
    // Check documents
    if (chatbotKnowledge.documents.keywords.some(k => lowerQuestion.includes(k))) {
        return chatbotKnowledge.documents.responses;
    }
    
    // Check KYC/AML
    if (chatbotKnowledge.kyc.keywords.some(k => lowerQuestion.includes(k))) {
        return chatbotKnowledge.kyc.responses;
    }
    
    // Check customs
    if (chatbotKnowledge.customs.keywords.some(k => lowerQuestion.includes(k))) {
        return chatbotKnowledge.customs.responses;
    }
    
    // Check assay
    if (chatbotKnowledge.assay.keywords.some(k => lowerQuestion.includes(k))) {
        return chatbotKnowledge.assay.responses;
    }
    
    // Check payment
    if (chatbotKnowledge.payment.keywords.some(k => lowerQuestion.includes(k))) {
        return chatbotKnowledge.payment.responses;
    }
    
    // Check hallmark
    if (chatbotKnowledge.hallmark.keywords.some(k => lowerQuestion.includes(k))) {
        return chatbotKnowledge.hallmark.responses;
    }
    
    // Check general questions - direkter
    if (chatbotKnowledge.general.keywords.some(k => lowerQuestion.includes(k))) {
        // Try to give a more specific answer based on the question
        if (lowerQuestion.includes('goldankauf') || lowerQuestion.includes('prozess')) {
            return 'Der Goldankauf-Prozess umfasst 19 Schritte von der Kontaktanbahnung bis zur Raffination. Welchen spezifischen Aspekt möchten Sie genauer wissen?';
        }
        return chatbotKnowledge.general.responses;
    }
    
    // Fallback - only if no keywords matched
    return chatbotKnowledge.fallback;
}

// ============================================
// Typing Indicator
// ============================================
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return null;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-content">
            <i class="ti ti-robot"></i>
            <div>
                <span class="typing-dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return typingDiv;
}

function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
    } else {
        const existing = document.getElementById('typing-indicator');
        if (existing) {
            existing.remove();
        }
    }
}
