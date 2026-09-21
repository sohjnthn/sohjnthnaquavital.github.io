import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
  Dimensions,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface QueryOption {
  id: string;
  label: string;
  category: string;
  answerText: string;
  slideReference?: string;
  videoUrl?: string;
}

const PRESET_QUERIES: QueryOption[] = [
  {
    id: '1',
    label: 'What is AquaVital Mineral Water?',
    category: 'Product Strategy (Slide 3)',
    answerText:
      'AquaVital is an affordable natural mineral water with naturally occurring essential minerals, featuring zero sugar, zero calories, and no preservatives. It is designed for healthy everyday family hydration across all settings.',
    slideReference: 'AquaVital-Mineral-Water.pptx & Marketing-Mix-Proposal-4Ps.pptx',
    videoUrl: 'https://youtu.be/Y6v2VfzzaaM?is=0c2fF1Ome1UcYLpm',
  },
  {
    id: '2',
    label: 'What is the Target Market & Positioning?',
    category: 'Target Market (Slide 1)',
    answerText:
      'Parents aged 30 to 55 from lower-middle to middle-income households seeking healthy, affordable hydration for their families. The core brand positioning is Healthy Hydration and Everyday Value.',
    slideReference: 'Marketing-Mix-Proposal-4Ps.pptx',
  },
  {
    id: '3',
    label: 'What are the Product Sizes & Pricing?',
    category: 'Product & Pricing (Slides 3 & 5)',
    answerText:
      'Available sizes include 500 mL priced at $0.80 to $1.00, 1.5 L priced at $1.20 to $1.60, 2 L priced at $1.50 to $1.80, and a 24-Bottle Family Value Carton priced at $10.00 to $14.00, utilizing a value-based pricing strategy.',
    slideReference: 'Healthy-Hydration-Everyday-Value.pptx',
  },
  {
    id: '4',
    label: 'Where can I buy AquaVital?',
    category: 'Place / Distribution (Slide 6)',
    answerText:
      'Omni-channel distribution is established across major supermarkets including NTUC FairPrice, Sheng Siong, Giant, and Cold Storage, alongside neighborhood minimarts, online grocery platforms, vending machines, and schools.',
    slideReference: 'Marketing-Mix-Proposal-4Ps.pptx',
  },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState<QueryOption | null>(PRESET_QUERIES[0]);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! Ask me anything about the AquaVital marketing presentation.' },
  ]);

  const [fixedChatInput, setFixedChatInput] = useState('');
  const [fixedChatMessages, setFixedChatMessages] = useState([
    { sender: 'bot', text: 'Welcome to the Marketing Assistant! Select a query or ask a question below.' },
  ]);

  const handleSearch = (queryText: string) => {
    setSearchQuery(queryText);
    const found = PRESET_QUERIES.find((q) =>
      q.label.toLowerCase().includes(queryText.toLowerCase())
    );
    if (found) {
      setSelectedOption(found);
    } else if (queryText.trim() !== '') {
      setSelectedOption({
        id: 'custom',
        label: queryText,
        category: 'Custom Presentation Search',
        answerText: `Insights from AquaVital Presentation and Video for ${queryText}. The marketing mix integrates SWOT analysis with Product, Price, Place, and Promotion to establish a trusted brand in Singapore.`,
        slideReference: 'AquaVital-Mineral-Water.pptx & Video',
        videoUrl: 'https://youtu.be/Y6v2VfzzaaM?is=0c2fF1Ome1UcYLpm',
      });
    }
  };

  const handleSelectQuery = (option: QueryOption) => {
    setSearchQuery(option.label);
    setSelectedOption(option);
  };

  const sendFloatingMessage = () => {
    if (!chatInput.trim()) return;
    const newMsgs = [...chatMessages, { sender: 'user', text: chatInput }];
    setChatMessages(newMsgs);
    setChatInput('');

    setTimeout(() => {
      setChatMessages([
        ...newMsgs,
        { sender: 'bot', text: 'Based on the slide deck and video, AquaVital delivers healthy hydration at everyday value.' },
      ]);
    }, 600);
  };

  const sendFixedMessage = () => {
    if (!fixedChatInput.trim()) return;
    const newMsgs = [...fixedChatMessages, { sender: 'user', text: fixedChatInput }];
    setFixedChatMessages(newMsgs);
    setFixedChatInput('');

    setTimeout(() => {
      setFixedChatMessages([
        ...newMsgs,
        { sender: 'bot', text: 'Noted. You can review the 4Ps strategy and budget breakdown in the presentation files.' },
      ]);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AquaVital Marketing Portal</Text>
        <Text style={styles.headerSubtitle}>Healthy Hydration. Everyday Value.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search slides, target market, 4Ps..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <Text style={styles.sectionTitle}>Select Query Option:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {PRESET_QUERIES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.chip,
                selectedOption?.id === item.id && styles.activeChip,
              ]}
              onPress={() => handleSelectQuery(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedOption?.id === item.id && styles.activeChipText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedOption && (
          <View style={styles.answerCard}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{selectedOption.category}</Text>
            </View>
            <Text style={styles.answerTitle}>{selectedOption.label}</Text>
            <Text style={styles.answerDescription}>{selectedOption.answerText}</Text>

            <View style={styles.slideBanner}>
              <Text style={styles.slideBannerIcon}>📊</Text>
              <View style={styles.slideBannerTextContainer}>
                <Text style={styles.slideBannerTitle}>Source Slide Reference</Text>
                <Text style={styles.slideBannerSubtitle}>{selectedOption.slideReference || 'AquaVital Presentation Deck'}</Text>
              </View>
            </View>

            {selectedOption.videoUrl && (
              <TouchableOpacity
                style={styles.videoButton}
                onPress={() => Linking.openURL(selectedOption.videoUrl!)}
              >
                <Text style={styles.videoButtonText}>▶ Play Video Reference (YouTube)</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.fixedChatCard}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatHeaderTitle}>💬 Fixed Position Chatbot</Text>
          </View>
          <View style={styles.chatBody}>
            {fixedChatMessages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text style={msg.sender === 'user' ? styles.userText : styles.botText}>
                  {msg.text}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask assistant..."
              placeholderTextColor="#888"
              value={fixedChatInput}
              onChangeText={setFixedChatInput}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendFixedMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {isChatOpen && (
        <View style={styles.floatingContainer}>
          <View style={styles.floatingHeader}>
            <Text style={styles.floatingTitle}>Floating Chatbot</Text>
            <TouchableOpacity onPress={() => setIsChatOpen(false)}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.floatingBody}>
            {chatMessages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text style={msg.sender === 'user' ? styles.userText : styles.botText}>
                  {msg.text}
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.floatingInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Type message..."
              placeholderTextColor="#888"
              value={chatInput}
              onChangeText={setChatInput}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendFloatingMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsChatOpen(!isChatOpen)}
      >
        <Text style={styles.fabText}>{isChatOpen ? '✕' : '💬'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  header: { backgroundColor: '#005B99', padding: 16, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#E0F1FF', fontSize: 13, marginTop: 4 },
  scrollContent: { padding: 16 },
  searchContainer: { marginBottom: 16 },
  searchInput: { backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#CCD6E0', color: '#333', fontSize: 15 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8 },
  chipsRow: { marginBottom: 16 },
  chip: { backgroundColor: '#E2E8F0', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, height: 36 },
  activeChip: { backgroundColor: '#005B99' },
  chipText: { color: '#334155', fontSize: 13 },
  activeChipText: { color: '#FFF', fontWeight: '600' },
  answerCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#E0F2FE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 8 },
  badgeText: { color: '#0369A1', fontSize: 11, fontWeight: 'bold' },
  answerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  answerDescription: { fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 12 },
  slideBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 12 },
  slideBannerIcon: { fontSize: 24, marginRight: 12 },
  slideBannerTextContainer: { flex: 1 },
  slideBannerTitle: { fontSize: 13, fontWeight: 'bold', color: '#334155' },
  slideBannerSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  videoButton: { backgroundColor: '#EF4444', padding: 12, borderRadius: 8, alignItems: 'center' },
  videoButtonText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  fixedChatCard: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', overflow: 'hidden', marginBottom: 20 },
  chatHeader: { backgroundColor: '#1E293B', padding: 12 },
  chatHeaderTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  chatBody: { padding: 12, height: 160, backgroundColor: '#F8FAFC' },
  messageBubble: { padding: 8, borderRadius: 8, marginBottom: 8, maxWidth: '80%' },
  botBubble: { backgroundColor: '#E2E8F0', alignSelf: 'flex-start' },
  userBubble: { backgroundColor: '#005B99', alignSelf: 'flex-end' },
  botText: { color: '#1E293B', fontSize: 13 },
  userText: { color: '#FFF', fontSize: 13 },
  chatInputRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFF' },
  chatInput: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 6, paddingHorizontal: 10, height: 38, fontSize: 13, color: '#333' },
  sendButton: { backgroundColor: '#005B99', justifyContent: 'center', paddingHorizontal: 14, borderRadius: 6, marginLeft: 6 },
  sendButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#005B99', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
  fabText: { color: '#FFF', fontSize: 22 },
  floatingContainer: { position: 'absolute', bottom: 90, right: 20, width: SCREEN_WIDTH > 400 ? 340 : SCREEN_WIDTH - 40, height: 380, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', elevation: 8, overflow: 'hidden', zIndex: 1000 },
  floatingHeader: { backgroundColor: '#005B99', padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  floatingTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  closeText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  floatingBody: { flex: 1, padding: 12, backgroundColor: '#F8FAFC' },
  floatingInputRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFF' },
});