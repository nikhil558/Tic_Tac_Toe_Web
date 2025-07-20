# 🎮 Tic Tac Toe – Multiplayer Game
A feature-rich, modern take on the classic Tic Tac Toe game, supporting both local and online multiplayer modes. Users can either play on the same device or share a room code to connect remotely.

# 🚀 Key Features:
- **Multiplayer Room System:** Players can create or join game rooms using unique room IDs. Moves are synchronized in real-time using Socket.IO, ensuring seamless multiplayer gameplay.

- **Local 2-Player Mode:** For casual offline play, users can enjoy a match on the same screen, with each player taking alternate turns.

- **Real-Time State Management:** The game leverages Redux to maintain player states, current turn, and game outcomes with consistent and efficient updates.

- **Responsive & Intuitive UI:** Built using Tailwind CSS, the interface adapts to all screen sizes, providing a smooth experience on both mobile and desktop.

- **Player Personalization:** Players can input their names before the match begins. Turn indicators and visual cues help users track progress easily.# Tic-Tac-Toe
# 🛠️ Tech Stack:
- **Frontend:** React.js, Tailwind CSS

- **Backend:** Node.js, Express.js

- **Real-time Communication:** Socket.IO
  
- **Authentication:** JWT-based secure auth system

- **Database:** MongoDB
   # frontend
    - Head
        - profile
        - History
        - Signout
    - Body
        - Login & Signup
        - Start game
          - Pass N Play
          - Create room or join room (online)
        - GameBoard

 # Backend 
    - Post - If user signup pass data to database (signup)
    - Post - Login (validation)
    - Get - History
    - Post - Profile update



 # Database
    - User data
    - History (userId, targetUserId, result)
    
