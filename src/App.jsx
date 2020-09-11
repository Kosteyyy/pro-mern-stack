const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
}

class IssueFilter extends React.Component {
    render() {
        return (
            <div>This is a placeholder for the issue filter.</div>
        );
    }
}

function IssueTable (props) {
    const issueRows = props.issues.map(issue => 
        <IssueRow key={issue.id} issue={issue}/>);
    return (
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Owner</th>
                    <th>Created</th>
                    <th>Effort</th>
                    <th>Due Date</th>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>
                {issueRows}
            </tbody>
        </table>
    );
}

function IssueRow (props) {
    const issue = props.issue;
    console.log("Render IssueRow: " + issue.id);        
    return (
        <tr>
            <td>{issue.id}</td>
            <td>{issue.status}</td>
            <td>{issue.owner}</td>
            <td>{issue.created.toDateString()}</td>
            <td>{issue.effort}</td>
            <td>{issue.due ? issue.due.toDateString() : ' '}</td>
            <td>{issue.title}</td>
        </tr>
    );
}


class IssueAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.issueAdd;
        const issue = {
            owner: form.owner.value, title: form.title.value,
            due: new Date(new Date().getTime() + 1000*60*60*24*10),
        }
        this.props.createIssue(issue);
        form.owner.value = "";
        form.title.value = "";
    }

    render() {
        return (
            <form name="issueAdd" onSubmit={this.handleSubmit}>
                <input type="text" name="owner" placeholder="Owner" required />
                <input type="text" name="title" placeholder="Title" required/>
                <button>Add</button>
            </form>
        );
    }
}

class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };

        this.createIssue = this.createIssue.bind(this);
}  

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query {
            issueList {
              id title status owner
              created effort due
            }
          }`;

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ query })
        });

        const body = await response.text();

        const result = JSON.parse(body, jsonDateReviver);
        this.setState({ issues: result.data.issueList });
    }
    
    createIssue(issue) {
        /* let newIssue = issue; */
        let newIssue = Object.assign({}, issue);
        newIssue.id = this.state.issues.length + 1;
        newIssue.created = new Date();
        const newIssueList = this.state.issues.slice();
        newIssueList.push(newIssue);
        this.setState({ issues: newIssueList });
    }

    render() {
        return (
            <React.Fragment>
                <h1>Issue Tracker ServerResponse</h1>
                <IssueFilter />
                <hr />
                <IssueTable issues={this.state.issues} />
                <hr />
                <IssueAdd createIssue={this.createIssue} />
            </React.Fragment>
        );
    }
}

const element = <IssueList />;

ReactDOM.render(element, document.getElementById('content'));
