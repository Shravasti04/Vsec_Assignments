
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

const emptyTeam = { name: "", coachName: "" };
const emptyPlayer = {
  name: "",
  age: "",
  role: "Batsman",
  team: ""
};

function App() {
  const [page, setPage] = useState("Dashboard");
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teamForm, setTeamForm] = useState(emptyTeam);
  const [playerForm, setPlayerForm] = useState(emptyPlayer);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  async function loadData() {
    try {
      const [teamData, playerData] = await Promise.all([
        request("/teams"),
        request("/players")
      ]);

      setTeams(teamData);
      setPlayers(playerData);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveTeam(event) {
    event.preventDefault();

    try {
      await request(
        editingTeam ? `/teams/${editingTeam}` : "/teams",
        {
          method: editingTeam ? "PUT" : "POST",
          body: JSON.stringify(teamForm)
        }
      );

      setTeamForm(emptyTeam);
      setEditingTeam(null);
      setMessage("Team saved successfully.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteTeam(id) {
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    try {
      await request(`/teams/${id}`, { method: "DELETE" });
      setMessage("Team deleted successfully.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function savePlayer(event) {
    event.preventDefault();

    try {
      await request(
        editingPlayer ? `/players/${editingPlayer}` : "/players",
        {
          method: editingPlayer ? "PUT" : "POST",
          body: JSON.stringify({
            ...playerForm,
            age: Number(playerForm.age)
          })
        }
      );

      setPlayerForm(emptyPlayer);
      setEditingPlayer(null);
      setMessage("Player saved successfully.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deletePlayer(id) {
    if (!window.confirm("Are you sure you want to delete this player?")) return;

    try {
      await request(`/players/${id}`, { method: "DELETE" });
      setMessage("Player deleted successfully.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function editTeam(team) {
    setTeamForm({
      name: team.name,
      coachName: team.coachName
    });
    setEditingTeam(team._id);
  }

  function editPlayer(player) {
    setPlayerForm({
      name: player.name,
      age: String(player.age),
      role: player.role,
      team: player.team?._id || ""
    });
    setEditingPlayer(player._id);
  }

  function cancelTeamEdit() {
    setEditingTeam(null);
    setTeamForm(emptyTeam);
  }

  function cancelPlayerEdit() {
    setEditingPlayer(null);
    setPlayerForm(emptyPlayer);
  }

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header>
        <h1>Cricket Team Management System</h1>
        <p>Manage teams and players</p>
      </header>

      <nav>
        {["Dashboard", "Team Management", "Player Management"].map((item) => (
          <button
            key={item}
            className={page === item ? "active" : ""}
            onClick={() => {
              setPage(item);
              setMessage("");
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      {message && <p className="message">{message}</p>}

      {page === "Dashboard" && (
        <main>
          <h2>Dashboard</h2>

          <div className="summary">
            <div className="summary-card">
              <h3>Total Teams</h3>
              <p>{teams.length}</p>
            </div>

            <div className="summary-card">
              <h3>Total Players</h3>
              <p>{players.length}</p>
            </div>
          </div>

          <h3>Teams</h3>
          {teams.length === 0 ? (
            <p>No teams added yet.</p>
          ) : (
            <ul>
              {teams.map((team) => (
                <li key={team._id}>
                  {team.name} — Coach: {team.coachName}
                </li>
              ))}
            </ul>
          )}

          <h3>Recent Players</h3>
          {players.length === 0 ? (
            <p>No players added yet.</p>
          ) : (
            <ul>
              {players.slice(0, 5).map((player) => (
                <li key={player._id}>
                  {player.name} — {player.role} —{" "}
                  {player.team?.name || "No team"}
                </li>
              ))}
            </ul>
          )}
        </main>
      )}

      {page === "Team Management" && (
        <main>
          <h2>Team Management</h2>

          <form onSubmit={saveTeam}>
            <label>Team Name</label>
            <input
              value={teamForm.name}
              onChange={(e) =>
                setTeamForm({ ...teamForm, name: e.target.value })
              }
              placeholder="Enter team name"
              required
            />

            <label>Coach Name</label>
            <input
              value={teamForm.coachName}
              onChange={(e) =>
                setTeamForm({ ...teamForm, coachName: e.target.value })
              }
              placeholder="Enter coach name"
              required
            />

            <button type="submit">
              {editingTeam ? "Update Team" : "Add Team"}
            </button>

            {editingTeam && (
              <button type="button" className="secondary" onClick={cancelTeamEdit}>
                Cancel
              </button>
            )}
          </form>

          <h3>Team List</h3>

          {teams.length === 0 ? (
            <p>No teams found. Add a team above.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th>Coach Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {teams.map((team) => (
                    <tr key={team._id}>
                      <td>{team.name}</td>
                      <td>{team.coachName}</td>
                      <td>
                        <button onClick={() => editTeam(team)}>Edit</button>
                        <button
                          className="danger"
                          onClick={() => deleteTeam(team._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      )}

      {page === "Player Management" && (
        <main>
          <h2>Player Management</h2>

          {teams.length === 0 && (
            <p className="message">
              Add a team in Team Management before adding players.
            </p>
          )}

          <form onSubmit={savePlayer}>
            <label>Player Name</label>
            <input
              value={playerForm.name}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, name: e.target.value })
              }
              placeholder="Enter player name"
              required
            />

            <label>Age</label>
            <input
              type="number"
              min="1"
              value={playerForm.age}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, age: e.target.value })
              }
              placeholder="Enter age"
              required
            />

            <label>Player Role</label>
            <select
              value={playerForm.role}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, role: e.target.value })
              }
            >
              <option>Batsman</option>
              <option>Bowler</option>
              <option>All-rounder</option>
              <option>Wicketkeeper</option>
            </select>

            <label>Assign Team</label>
            <select
              value={playerForm.team}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, team: e.target.value })
              }
              required
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>

            <button type="submit" disabled={teams.length === 0}>
              {editingPlayer ? "Update Player" : "Add Player"}
            </button>

            {editingPlayer && (
              <button
                type="button"
                className="secondary"
                onClick={cancelPlayerEdit}
              >
                Cancel
              </button>
            )}
          </form>

          <h3>Player List</h3>

          <input
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search player by name"
          />

          {filteredPlayers.length === 0 ? (
            <p>No players found.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Role</th>
                    <th>Team</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPlayers.map((player) => (
                    <tr key={player._id}>
                      <td>{player.name}</td>
                      <td>{player.age}</td>
                      <td>{player.role}</td>
                      <td>{player.team?.name || "No team"}</td>
                      <td>
                        <button onClick={() => editPlayer(player)}>Edit</button>
                        <button
                          className="danger"
                          onClick={() => deletePlayer(player._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      )}

      <footer>Cricket Team Management System</footer>
    </div>
  );
}

export default App;
